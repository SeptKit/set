// XML PARSER
import * as sax from 'sax'
// DATABASE
import { bulkAddRecords, bulkUpdateRelationships, bulkCreateTables } from './import.database'
// GUARDS
import { isSaxQualifiedTag } from './import.guards'
// CONSTANTS
import { TAG_NAMES } from '@/common/common.constant'
// TYPES
import { State, NewRelationship, AsyncQueue } from './import.types'
import {
	DatabaseRecord,
	DatabaseInstance,
	AvailableTagName,
	Relationship,
	Namespace,
} from '@/common/common.types'

//====== PUBLIC FUNCTIONS ======//

/**
 * Sets up the SAX parser for XML parsing.
 * @param databaseInstance Dexie database instance
 * @returns SAX parser instance
 */
export function setSaxParser(
	databaseInstance: DatabaseInstance,
	queue: AsyncQueue<DatabaseRecord>
) {
	const initialState: State = {
		currentId: '',
		currentTagName: '',
		currentValue: '',
		currentParentElements: [],
		recordsBatch: {},
		relationshipsBatch: {},
		tablesToCreate: [],
	}

	let state = initialState
	// let processingQueue: Array<() => Promise<void>> = []
	// let isProcessing = false

	// Process items in the queue sequentially
	// async function processQueue() {
	// 	if (isProcessing) return
	// 	isProcessing = true

	// 	while (processingQueue.length > 0) {
	// 		const operation = processingQueue.shift()
	// 		if (operation) {
	// 			try {
	// 				await operation()
	// 			} catch (error) {
	// 				console.error('Error processing operation:', error)
	// 			}
	// 		}
	// 	}

	// 	isProcessing = false
	// }

	const parser = sax.parser(
		true, // strict mode
		{
			lowercase: false, // Preserve case
			trim: true, // Trim text nodes
			normalize: true, // Normalize whitespace
			position: false, // Don't track position (performance boost)
			xmlns: true, // Enable namespace handling
		}
	)

	const queues = {
		Substation: queue()
	}
	function ensureQueue(tableName: string){
		let q = queues[tableName]
		if(!q){
			const newQ = queue()
			queues[tableName] = newQ
			q = newQ
		}

		return q
	}

	// Instead of modifying state directly, each handler returns a new state
	parser.onopentag = (node: sax.QualifiedTag) => {
		// state = handleOpenTag({ node, state: { ...state }, queue })
		recordElement = handleOpenTag({ node, state: { ...state }, queue })

		const queue = ensureQueue(recordElement.tagName)
		queue.push(recordElement)



	}

	parser.ontext = (text) => {
		state = handleText(text, { ...state })
	}

	parser.onclosetag = async (tagName: AvailableTagName) => {
		state = await handleCloseTag(tagName, databaseInstance, { ...state })
		//const currentState = { ...state } // Capture current state for logging

		// console.log(
		// 	`BEFORE handleCloseTag: ${tagName}, parents:`,
		// 	JSON.stringify(
		// 		currentState.currentParentElements.map((p) => ({ id: p.id.slice(0, 8), tag: p.tagName }))
		// 	)
		// )

		// // Queue the async operation
		// processingQueue.push(async () => {
		// 	state = await handleCloseTag(tagName, databaseInstance, { ...state })

		// 	console.log(
		// 		`AFTER handleCloseTag: ${tagName}, parents:`,
		// 		JSON.stringify(
		// 			state.currentParentElements.map((p) => ({ id: p.id.slice(0, 8), tag: p.tagName }))
		// 		)
		// 	)
		// })

		// // Start processing the queue
		// processQueue()
	}

	parser.onend = async () => {
 	await handleEnd(databaseInstance, { ...state })
	// 	processingQueue.push(async () => {
	// 		await handleEnd(databaseInstance, { ...state })
	// 		state = initialState
	// 		console.log('Parsing complete, state reset')
	// 	})

	// 	processQueue()
	// }

	parser.onerror = handleError

	return parser
}

/**
 * <Substation> open:[Substation]
 * 	 <VoltageLevel> open:[ Substation, VoltageLevel]
 * 		<Bay> open: [ Substation, VoltageLevel, Bay]
 *      </Bay> close: Bay [Substation, VoltageLevel]
 *   </VoltageLevel> close: VoltageLevel [Substation]
 * </Substation> []
 */

//====== PARSER EVENT HANDLERS ======//

/**
 * Handles the opening tag event.
 * @param node sax element
 * @param state Current tracker state
 * @returns Updated tracker state
 */
function handleOpenTag(params: {
	node: sax.QualifiedTag
	state: State
	queue: AsyncQueue<DatabaseRecord>
}): State {
	const { node, state, queue } = params

	const recordId = crypto.randomUUID()
	const tagName = getElementLocalName(node)
	console.log(tagName)
	const namespace = getElementNamespace(node)
	const attributes = getElementAttributes(node.attributes)
	const parent = getParent(state.currentParentElements)

	console.log(node)

	const record: DatabaseRecord = {
		id: recordId,
		tagName,
		namespace,
		attributes,
		value: null,
		parent: parent ? { id: parent.id, tagName: parent.tagName } : null,
		children: [],
	}

	// Create new recordsBatch with the new record
	const updatedRelationshipsBatch = { ...state.relationshipsBatch }
	//////
	const { updatedRecordsBatch, newChildRelationship } = handleChildRelationships({
		child: {
			id: record.id,
			tagName: record.tagName,
		},
		parent,
		recordsBatch: state.recordsBatch,
	})

	console.error('newChildRelationship', newChildRelationship)

	if (newChildRelationship && parent) {
		if (!updatedRelationshipsBatch[parent.tagName]) {
			updatedRelationshipsBatch[parent.tagName] = []
		}

		updatedRelationshipsBatch[parent.tagName] = [
			...updatedRelationshipsBatch[parent.tagName],
			newChildRelationship,
		]
	}
	//////

	if (!updatedRecordsBatch[tagName]) {
		updatedRecordsBatch[tagName] = []
	}
	updatedRecordsBatch[tagName] = [...updatedRecordsBatch[tagName], record]

	// Create new parentElements array with the new id
	const updatedParentElements = [...state.currentParentElements, { id: recordId, tagName }]

	// Return a new state object
	return {
		currentId: recordId,
		currentTagName: tagName,
		currentValue: '',
		currentParentElements: updatedParentElements,
		recordsBatch: updatedRecordsBatch,
		relationshipsBatch: state.relationshipsBatch,
		tablesToCreate: TAG_NAMES.includes(tagName)
			? state.tablesToCreate
			: [...state.tablesToCreate, tagName],
	}
}

/**
 * Handles the text event.
 * @param text Text content of the current element
 * @param state Current state
 * @returns Updated state
 *
 */
function handleText(text: string, state: State): State {
	if (!text) return state

	const { currentTagName, currentId, recordsBatch } = state

	// Create a new recordsBatch
	const updatedRecordsBatch = { ...recordsBatch }

	if (updatedRecordsBatch[currentTagName]) {
		const recordIndex = updatedRecordsBatch[currentTagName].findIndex(
			(record) => record.id === currentId
		)

		if (recordIndex >= 0) {
			// Create a new array for the current tag
			updatedRecordsBatch[currentTagName] = [...updatedRecordsBatch[currentTagName]]

			// Update the specific record with new value
			const currentValue = updatedRecordsBatch[currentTagName][recordIndex].value || ''
			updatedRecordsBatch[currentTagName][recordIndex] = {
				...updatedRecordsBatch[currentTagName][recordIndex],
				value: (currentValue + text).trim(),
			}
		}
	}

	// Return a new state object
	return {
		...state,
		currentValue: state.currentValue + text,
		recordsBatch: updatedRecordsBatch,
	}
}

/**
 * Handles the closing tag event.
 * @param tagName Name of the closing tag
 * @param databaseInstance Dexie database instance
 * @param state Current state
 * @returns Updated state
 */
async function handleCloseTag(
	tagName: AvailableTagName,
	databaseInstance: DatabaseInstance,
	state: State
): Promise<State> {
	const BATCH_SIZE = 2000

	// Create new parentElements by removing the last element
	const updatedRecordsBatch = { ...state.recordsBatch }
	const updatedParentElements = [...state.currentParentElements]
	const updatedRelationshipsBatch = { ...state.relationshipsBatch }
	console.log(`Closing tag: ${tagName}, state:`, {
		parentElements: updatedParentElements.map((p) => `${p.tagName}:${p.id}`),
		current: state.currentTagName,
	})
	const currentElement = updatedParentElements.pop()
	const parentElement = updatedParentElements[updatedParentElements.length - 1]
	console.log('current parent elements after pop:', updatedParentElements)
	// Create a new recordsBatch
	// const updatedRecordsBatch = { ...state.recordsBatch }
	if (!currentElement || !parentElement)
		return {
			...state,
			currentParentElements: updatedParentElements,
		}

	const shouldAddRecords =
		updatedRecordsBatch[tagName] &&
		updatedRecordsBatch[tagName].length >= BATCH_SIZE &&
		!state.tablesToCreate.includes(tagName)

	if (shouldAddRecords) {
		await bulkAddRecords({
			databaseInstance,
			tagName,
			records: updatedRecordsBatch[tagName],
		})

		// Reset the records for this tag
		updatedRecordsBatch[tagName] = []
	}

	const shouldUpdateRelationships =
		updatedRelationshipsBatch[parentElement.tagName] &&
		updatedRelationshipsBatch[parentElement.tagName].length >= BATCH_SIZE &&
		!state.tablesToCreate.includes(parentElement.tagName)

	if (shouldUpdateRelationships) {
		await bulkUpdateRelationships({
			databaseInstance,
			parentTagName: parentElement.tagName,
			relationshipRecords: updatedRelationshipsBatch[parentElement.tagName],
		})

		// Reset the records for this tag
		updatedRelationshipsBatch[parentElement.tagName] = []
	}

	// Return a new state object
	return {
		...state,
		currentParentElements: updatedParentElements,
		recordsBatch: updatedRecordsBatch,
		relationshipsBatch: updatedRelationshipsBatch,
	}
}

/**
 * Finalizes the parsing process and handles any remaining records.
 * @param databaseInstance Dexie database instance
 * @param state Current state
 */
async function handleEnd(databaseInstance: DatabaseInstance, state: State): Promise<void> {
	console.log('Parsing completed. Processing remaining records...')

	await bulkCreateTables(databaseInstance, state.tablesToCreate)

	// Process any remaining records in the batch
	const batchPromises = Object.entries(state.recordsBatch)
		.filter(([_, records]) => records.length > 0)
		.map(([tagName, records]) =>
			bulkAddRecords({
				databaseInstance,
				tagName,
				records,
			})
		)

	await Promise.all(batchPromises)

	// Process any remaining relationships in the batch
	const relationshipPromises = Object.entries(state.relationshipsBatch)
		.filter(([_, relationships]) => relationships.length > 0)
		.map(([parentTagName, relationships]) =>
			bulkUpdateRelationships({
				databaseInstance,
				parentTagName,
				relationshipRecords: relationships,
			})
		)
	await Promise.all(relationshipPromises)
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

function getElementAttributes(attributes: Record<string, sax.QualifiedAttribute>) {
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
			...namespace,
		}
	})
}

function getParent(
	currentParentElements: Array<{ id: string; tagName: AvailableTagName }>
): { id: string; tagName: AvailableTagName } | null {
	if (currentParentElements.length === 0) return null

	const lastParent = currentParentElements[currentParentElements.length - 1]
	return lastParent
}
