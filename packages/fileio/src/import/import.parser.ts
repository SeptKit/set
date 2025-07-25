// XML PARSER
import * as sax from 'sax'
// CONSTANTS
import { TAG_NAMES } from '@/common'
// QUEUE
import { ensureQueue, ensureEndingQueue, closeAllQueues } from './import.queue'
// RELATIONSHIPS
import { registerPendingChildrenRelationship } from './import.relationships'
// GUARDS
import { isSaxQualifiedTag } from './import.guards'
// TYPES
import { State, ParserOptions } from './import.types'
import {
	DatabaseRecord,
	DatabaseInstance,
	AvailableTagName,
	Namespace,
	Attribute,
	QualifiedAttribute,
} from '@/common/common.types'

//====== PUBLIC FUNCTIONS ======//

/**
 * Sets up the SAX parser for XML parsing.
 * @param databaseInstance Dexie database instance
 * @returns SAX parser instance
 */
export function setSaxParser(params: {
	databaseInstance: DatabaseInstance
	options: ParserOptions
}) {
	const { databaseInstance, options } = params

	const initialState: State = {
		stack: [],
		currentParentElements: [],
	}

	let state = initialState

	const parser = sax.parser(
		true, // strict mode
		{
			lowercase: false, // Preserve case
			trim: true, // Trim text nodes
			normalize: true, // Normalize whitespace
			position: false, // Don't track position (performance boost)
			xmlns: true, // Enable namespace handling
		},
	)

	parser.onopentag = (node: sax.QualifiedTag) => {
		state = handleOpenTag({ node, state: { ...state } })
	}

	parser.ontext = (text) => {
		state = handleText({ text, state: { ...state } })
	}

	parser.onclosetag = () => {
		state = handleCloseTag({ state: { ...state }, databaseInstance, options })
	}

	parser.onend = () => {
		handleEnd(databaseInstance)
	}
	parser.onerror = handleError

	return parser
}

//====== PARSER EVENT HANDLERS ======//

/**
 * Handles the opening tag event.
 * @param node sax element
 * @param state Current tracker state
 * @returns Updated tracker state
 */
function handleOpenTag(params: { node: sax.QualifiedTag; state: State }) {
	const { node, state } = params
	const updatedState = { ...state }

	const recordId = crypto.randomUUID()
	const tagName = getElementLocalName(node)
	const namespace = getElementNamespace(node)
	const attributes = getElementAttributes(node.attributes)
	const parent = getParent(state.currentParentElements)

	const record: DatabaseRecord = {
		id: recordId,
		tagName,
		namespace,
		attributes,
		value: '',
		parent: parent ? { id: parent.id, tagName: parent.tagName } : null,
		children: [],
	}

	updatedState.stack.push(record)
	updatedState.currentParentElements = [
		...updatedState.currentParentElements,
		{ id: recordId, tagName },
	]

	return updatedState
}

/**
 * Handles the text event.
 * @param text Text content of the current element
 * @param state Current state
 * @returns Updated state
 *
 */
function handleText(params: { text: string; state: State }): State {
	const { text, state } = params

	if (!text) return state
	if (state.stack.length > 0) state.stack[state.stack.length - 1].value += text

	return state
}

/**
 * Handles the closing tag event.
 * @param tagName Name of the closing tag
 * @param state Current state
 * @param databaseInstance Dexie database instance
 * @param options Parser options
 * @returns Updated state
 */
function handleCloseTag(params: {
	state: State
	databaseInstance: DatabaseInstance
	options: ParserOptions
}): State {
	const { state, databaseInstance, options } = params
	const updatedState = { ...state }

	const currentRecord = updatedState.stack.pop()
	updatedState.currentParentElements.pop()

	if (currentRecord) {
		if (updatedState.stack.length) {
			// create children relationship if parent is still in the stack
			const parentIndex = updatedState.stack.length - 1
			updatedState.stack[parentIndex].children = updatedState.stack[parentIndex].children || []

			updatedState.stack[parentIndex].children.push({
				id: currentRecord.id,
				tagName: currentRecord.tagName,
			})
		} else if (currentRecord.parent)
			registerPendingChildrenRelationship({
				parent: currentRecord.parent,
				child: { id: currentRecord.id, tagName: currentRecord.tagName },
			})

		const initialDatabaseTablesList = TAG_NAMES
		const queue = initialDatabaseTablesList.includes(currentRecord.tagName)
			? ensureQueue({
					databaseInstance,
					tagName: currentRecord.tagName,
					batchSize: options.batchSize,
				})
			: ensureEndingQueue({
					tagName: currentRecord.tagName,
					batchSize: options.batchSize,
				})

		queue.push(currentRecord)
	}

	return updatedState
}

/**
 * Finalizes the parsing process and handles any remaining records.
 * @param databaseInstance Dexie database instance
 * @param state Current state
 */
function handleEnd(databaseInstance: DatabaseInstance) {
	closeAllQueues({ databaseInstance })
}

/**
 * Handles SAX parser errors.
 * @param error SAX parser error
 * @returns Error object with a message
 */
function handleError(error: Error): Error {
	return new Error(`XML parsing error: ${error}`)
}

//====== HELPER FUNCTIONS ======//

function getElementLocalName(element: sax.QualifiedTag): AvailableTagName {
	return (element.local as AvailableTagName) || null
}

function getElementNamespace(element: sax.Tag | sax.QualifiedTag): Namespace | null {
	if (isSaxQualifiedTag(element))
		return {
			prefix: element.prefix,
			uri: element.uri,
		}
	return null
}

function getElementAttributes(
	attributes: Record<string, sax.QualifiedAttribute>,
): (Attribute | QualifiedAttribute)[] {
	return Object.values(attributes).map((attribute) => {
		const namespace =
			!!attribute.prefix && !!attribute.uri
				? {
						prefix: attribute.prefix,
						uri: attribute.uri,
					}
				: null

		return {
			name: attribute.name,
			value: attribute.value,
			namespace,
		}
	})
}

function getParent(currentParentElements: Array<{ id: string; tagName: AvailableTagName }>): {
	id: string
	tagName: AvailableTagName
} | null {
	if (currentParentElements.length === 0) return null

	const lastParent = currentParentElements[currentParentElements.length - 1]
	return lastParent
}
