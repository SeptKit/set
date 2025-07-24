// DATABASES
import { bulkAddRecords, bulkCreateTables } from './import.database'
// RELATIONSHIPS
import { resolveCurrentBatchChildrenRelationships } from './import.relationships'
// TYPES
import type { QueueResult, ResolverFunction, CreateAsyncQueue, Queues } from './import.types'
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
}): CreateAsyncQueue {
	const { databaseInstance, tagName, batchSize } = params
	let queue = queues[tagName]?.instance

	if (!queue) {
		const newQueue = createAsyncQueue({ batchSize })
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
}): CreateAsyncQueue {
	const { tagName, batchSize } = params
	let queue = endingQueues[tagName]?.instance

	if (!queue) {
		const newQueue = createAsyncQueue({ batchSize })
		endingQueues[tagName] = { status: 'pending', instance: newQueue }
		return newQueue
	}

	return queue
}

export function closeAllQueues(params: { databaseInstance: DatabaseInstance }) {
	const { databaseInstance } = params

	for (const queue of Object.values(queues)) queue.instance.close()

	const unsubscribe = queuesObservable.subscribe(async () => {
		await bulkCreateTables({
			databaseInstance: databaseInstance,
			tagNames: Object.keys(queues),
		})

		const endingQueuesEntries = Object.entries(endingQueues) as [
			AvailableTagName,
			{ instance: CreateAsyncQueue }
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

function createAsyncQueue(params: { batchSize: number }): CreateAsyncQueue {
	const { batchSize } = params
	let queue: DatabaseRecord[] = []
	let closed = false
	let nextResolve: ResolverFunction | undefined = undefined

	return { push, next, close }

	// When a consumer wants data but none is available,
	// a "resolver" is created and stored.
	// When data is pushed, the resolver is called with the data.
	async function next(): Promise<QueueResult> {
		const closedWithoutData = queue.length === 0 && closed
		if (closedWithoutData) return Promise.resolve({ value: [], done: true })

		const closedButHasData = closed && queue.length > 0
		const isDataAvailable = queue.length >= batchSize

		if (closedButHasData || isDataAvailable) {
			const elementsBatch = queue.splice(0, batchSize)
			return Promise.resolve({ value: elementsBatch, done: false })
		}

		const { resolve, promise } = Promise.withResolvers<QueueResult>()
		nextResolve = resolve
		return promise
	}

	// When a producer adds data, they check if any consumers are waiting
	function push(item: DatabaseRecord) {
		const isBatchReached = queue.length >= batchSize

		if (isBatchReached && nextResolve) {
			const elementsBatch = queue.splice(0, batchSize)
			nextResolve({ value: elementsBatch, done: false })
			nextResolve = undefined
		}

		queue.push(item)
	}

	function close(): void {
		closed = true
		if (nextResolve) {
			const elementsBatch = queue.splice(0, batchSize)
			nextResolve({ value: elementsBatch, done: false })
			nextResolve = undefined
		}
	}
}

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
	queue: CreateAsyncQueue
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
