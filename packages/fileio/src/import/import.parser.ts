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
import { ParserState, ImportContext } from './import.types'
import {
	DatabaseRecord,
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
export function setSaxParser(params: { importContext: ImportContext }): {
	xmlParser: sax.SAXParser
	importContext: ImportContext
} {
	const { importContext } = params

	const initialState: ParserState = {
		stack: [],
		currentParentElements: [],
	}

	let updatedState = initialState
	let updatedImportContext: ImportContext = {
		...importContext,
	}

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

	parser.onopentag = (node: sax.QualifiedTag) =>
		(updatedState = handleOpenTag({ node, state: updatedState }))

	parser.ontext = (text) => (updatedState = handleText({ text, state: updatedState }))

	parser.onclosetag = () =>
		({ updatedState, updatedImportContext } = handleCloseTag({
			state: updatedState,
			importContext,
		}))

	parser.onend = () => (updatedImportContext = handleEnd({ importContext: updatedImportContext }))

	parser.onerror = handleError

	return { xmlParser: parser, importContext: updatedImportContext }
}

//====== PARSER EVENT HANDLERS ======//

/**
 * Handles the opening tag event.
 * @param node sax element
 * @param state Current tracker state
 * @returns Updated tracker state
 */
function handleOpenTag(params: { node: sax.QualifiedTag; state: ParserState }) {
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
function handleText(params: { text: string; state: ParserState }): ParserState {
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
function handleCloseTag(params: { state: ParserState; importContext: ImportContext }): {
	updatedState: ParserState
	updatedImportContext: ImportContext
} {
	const { state, importContext } = params
	// const updatedState = { ...state }
	let updatedImportContext: ImportContext = { ...importContext }
	let updatedStack = [...state.stack]
	let updatedCurrentParentElements = [...state.currentParentElements]

	const currentRecord = state.stack.at(-1)
	// removing the last record from the stack and current parent elements
	updatedStack = state.stack.slice(0, -1)
	updatedCurrentParentElements = state.currentParentElements.slice(0, -1)

	if (currentRecord) {
		if (state.stack.length) {
			// create children relationship if parent is still in the stack
			const parentIndex = state.stack.length - 1

			updatedStack = updatedStack.map((item, idx) =>
				idx === parentIndex
					? {
							...item,
							children: [
								...(item.children || []),
								{ id: currentRecord.id, tagName: currentRecord.tagName },
							],
						}
					: item,
			)
		} else if (currentRecord.parent)
			registerPendingChildrenRelationship({
				parent: currentRecord.parent,
				child: { id: currentRecord.id, tagName: currentRecord.tagName },
			})

		const initialDatabaseTablesList = TAG_NAMES

		if (initialDatabaseTablesList.includes(currentRecord.tagName)) {
			updatedImportContext = ensureQueue({
				tagName: currentRecord.tagName,
				importContext: updatedImportContext,
			})
			updatedImportContext.queues[currentRecord.tagName]?.push(currentRecord)
		} else {
			console.log(`Tag ${currentRecord.tagName} is not in the initial database tables list.`)
			updatedImportContext = ensureEndingQueue({
				tagName: currentRecord.tagName,
				importContext: updatedImportContext,
			})
			updatedImportContext.endingQueues[currentRecord.tagName]?.push(currentRecord)
		}
	}

	return {
		updatedState: {
			stack: updatedStack,
			currentParentElements: updatedCurrentParentElements,
		},
		updatedImportContext,
	}
}

/**
 * Finalizes the parsing process and handles any remaining records.
 * @param databaseInstance Dexie database instance
 * @param state Current state
 */
function handleEnd(params: { importContext: ImportContext }): ImportContext {
	const { importContext } = params

	return closeAllQueues({
		importContext,
	})
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
