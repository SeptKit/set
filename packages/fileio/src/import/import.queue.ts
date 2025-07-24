// DATABASES
import { bulkAddRecords, bulkCreateTables } from './import.database'
// RELATIONSHIPS
import { resolveCurrentBatchChildrenRelationships } from './import.relationships'
// TYPES
import type { Queues } from './import.types'
import type { AsyncQueue } from './async-queue/async-queue.type'
import { createAsyncQueue } from './async-queue/async-queue'
import type { AvailableTagName, DatabaseInstance, DatabaseRecord } from '@/common'

//====== STATE MANAGEMENT ======//

const queues: Partial<Queues> = {}
const endingQueues: Partial<Queues> = {}
const queuesObservable = createQueuesObservable(queues)

//====== PUBLIC FUNCTIONS ======//

export function ensureQueue(params: {
	databaseInstance: DatabaseInstance
	tagName: AvailableTagName
	batchSize: number
}): AsyncQueue<DatabaseRecord> {
	const { databaseInstance, tagName, batchSize } = params
	let queue = queues[tagName]?.instance

	if (!queue) {
		const newQueue = createAsyncQueue<DatabaseRecord>({ batchSize })
		queues[tagName] = { status: 'pending', instance: newQueue }

		// event loop deferral
		queueMicrotask(() => {
			consumeQueueAndSaveToDatabase({
				databaseInstance,
				tagName,
				queue: newQueue,
			}).catch((error) => {
				console.error(`Consumer error for ${tagName}:`, error)
			})
		})

		return newQueue
	}

	return queue
}

export function ensureEndingQueue(params: {
	tagName: AvailableTagName
	batchSize: number
}): AsyncQueue<DatabaseRecord> {
	const { tagName, batchSize } = params
	let queue = endingQueues[tagName]?.instance

	if (!queue) {
		const newQueue = createAsyncQueue<DatabaseRecord>({ batchSize })
		endingQueues[tagName] = { status: 'pending', instance: newQueue }
		return newQueue
	}

	return queue
}

export function closeAllQueues(params: { databaseInstance: DatabaseInstance }) {
	const { databaseInstance } = params

	for (const queue of Object.values(queues)) {
		queue.instance.close()
	}

	const unsubscribe = queuesObservable.subscribe(async () => {
		await bulkCreateTables({
			databaseInstance: databaseInstance,
			tagNames: Object.keys(queues),
		})

		const endingQueuesEntries = Object.entries(endingQueues) as [
			AvailableTagName,
			{ instance: AsyncQueue<DatabaseRecord> },
		][]

		for (const [tagName, { instance: queue }] of endingQueuesEntries) {
			queue.close()
			queueMicrotask(() => {
				consumeQueueAndSaveToDatabase({
					databaseInstance,
					tagName,
					queue,
				}).catch((error) => {
					console.error(`Consumer error for ${tagName}:`, error)
				})
			})
		}

		unsubscribe()
	})
}

//====== PRIVATE FUNCTIONS ======//

function createQueuesObservable(queues: Partial<Queues>) {
	const listeners = new Set<() => void>()

	function subscribe(listener: () => void) {
		listeners.add(listener)
		// Return an unsubscribe function
		return () => listeners.delete(listener)
	}

	function notify() {
		for (const listener of listeners) {
			listener()
		}
	}

	function isAllDone() {
		return Object.values(queues).every((queue) => queue.status === 'done')
	}

	return { subscribe, notify, isAllDone }
}

async function consumeQueueAndSaveToDatabase(params: {
	databaseInstance: DatabaseInstance
	tagName: AvailableTagName
	queue: AsyncQueue<DatabaseRecord>
}) {
	const { databaseInstance, tagName, queue } = params

	while (true) {
		const { value: elementsBatch, done } = await queue.next()

		if (done && queues[tagName]) {
			queues[tagName].status = 'done'
			if (queuesObservable.isAllDone()) queuesObservable.notify()
			break
		}

		if (elementsBatch.length === 0) continue

		const elementsBatchWithResolvedRelationships = resolveCurrentBatchChildrenRelationships({
			parentRecordsBatch: elementsBatch,
			// within the same batch, all records have the same tagName
			parentTagName: elementsBatch[0].tagName,
		})

		await bulkAddRecords({
			databaseInstance,
			tagName,
			records: elementsBatchWithResolvedRelationships,
		})
	}
}
