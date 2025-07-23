// TYPES
import type { QueueResult, ResolverFunction, AsyncQueue } from './import.types'
import type { DatabaseInstance } from '@/common'

export function createAsyncQueue<T>(params: { batchSize: number }) {
	let queue: T[] = []
	let closed = false
	let nextResolve: ResolverFunction

	return { push, next, close }

	// When a consumer wants data but none is available,
	// their "resolver" gets added to the waiting list
	async function next(): Promise<QueueResult> {
		const closedWithoutData = queue.length === 0 && closed
		if (closedWithoutData) {
			return Promise.resolve({ value: [], done: true })
		}

		const closedButHasData = closed && queue.length > 0
		if (closedButHasData) {
			const elements = queue.splice(0, params.batchSize)
			return Promise.resolve({ value: elements, done: false })
		}

		const isDataAvailable = queue.length >= params.batchSize
		if (isDataAvailable) {
			const elements = queue.splice(0, params.batchSize)
			return Promise.resolve({ value: elements, done: false })
		}

		const { resolve, promise } = Promise.withResolvers<QueueResult>()

		nextResolve = resolve

		return promise
	}

	// When a producer adds data, they check if any consumers are waiting
	function push(item: T) {
		const isBatchReached = queue.length > params.batchSize
		if (isBatchReached) {
			if (nextResolve) {
				const elements = queue.splice(0, params.batchSize)
				nextResolve({ value: elements, done: false })
			}
		}

		queue.push(item)
	}

	function close(): void {
		closed = true
		if (nextResolve) {
			nextResolve({ value: queue, done: true })
		}
	}
}

async function consumeQueueAndSaveToDatabase<T>(params: {
	queue: AsyncQueue<T>
	databaseInstance: DatabaseInstance
	batchSize: number
}) {
	const batchers = {} // {tagName: []}
	const BATCH_SIZE = 2000

	while (true) {
		const { value: element, done } = await params.queue.next()

		if (done) {
			break
		}

		// Add element to batch
		// batchers[element.tagName] = batchers[element.tagName] || []
		// batchers[element.tagName].push(element)

		// if (batchers[element.tagName].length >= BATCH_SIZE) {
		// 	const table = db.table(element.tagName)
		// 	await table.bulkAdd(batchers[element.tagName])
		// 	batchers[element.tagName] = []
		// }
	}

	// After finishing, flush all
	for (const [tag, batch] of Object.entries(batchers)) {
		if (batch.length) {
			await db.table(tag).bulkAdd(batch)
		}
	}
}

function handleChildRelationships(params: {
	child: Relationship
	parent: Relationship | null
	recordsBatch: Record<AvailableTagName, DatabaseRecord[]>
}): {
	updatedRecordsBatch: Record<AvailableTagName, DatabaseRecord[]>
	newChildRelationship: NewRelationship | null
} {
	console.log('Handling child relationships:', params)
	const updatedRecordsBatch = { ...params.recordsBatch }

	const { child, parent } = params
	if (!parent)
		return {
			updatedRecordsBatch,
			newChildRelationship: null,
		}

	// Try to find the parent in the current batch
	let parentUpdated = false

	// Check each tag type to find the parent
	const recordsBatchEntries = Object.entries(updatedRecordsBatch) as [
		AvailableTagName,
		DatabaseRecord[]
	][]
	for (const [parentTagName, records] of recordsBatchEntries) {
		const parentIndex = records.findIndex((record) => record.id === parent.id)

		if (parentIndex >= 0) {
			// Parent found in batch - update directly
			if (!updatedRecordsBatch[parentTagName][parentIndex].children)
				updatedRecordsBatch[parentTagName][parentIndex].children = []

			updatedRecordsBatch[parentTagName][parentIndex].children.push({
				id: child.id,
				tagName: child.tagName,
			})

			parentUpdated = true
			break
		}
	}

	// If parent not found in batch, it must be in the database already

	const newChildRelationship = parentUpdated
		? null
		: {
				parentId: parent.id,
				childId: child.id,
				childTagName: child.tagName,
		  }

	return {
		updatedRecordsBatch,
		newChildRelationship,
	}
}
