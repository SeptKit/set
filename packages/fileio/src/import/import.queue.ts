// DATABASES
import { bulkAddRecords, bulkCreateTables } from './import.database'
// RELATIONSHIPS
import { resolveCurrentBatchChildrenRelationships } from './import.relationships'
// GUARDS
import { isTagNameInQueues } from './import.guards'
// QUEUE
import { createAsyncQueue } from './async-queue/async-queue'
// TYPES
import type { EndingQueues, Queues, QueueObservable, ImportContext } from './import.types'
import type { AvailableTagName, DatabaseRecord } from '@/common'

//====== PUBLIC FUNCTIONS ======//

export function ensureQueue(params: {
	tagName: AvailableTagName
	importContext: ImportContext
}): ImportContext {
	const { importContext, tagName } = params

	const updatedImportContext = {
		...importContext,
	}

	let currentQueue = updatedImportContext.queues[tagName]

	if (!currentQueue) {
		const newQueue = createAsyncQueue<DatabaseRecord>({
			batchSize: updatedImportContext.options.batchSize,
		})

		updatedImportContext.queues[tagName] = newQueue

		// event loop deferral
		queueMicrotask(() => {
			consumeQueueAndSaveToDatabase({
				tagName,
				importContext: updatedImportContext,
				isEndingQueue: false,
			}).catch((error) => {
				console.error(`Consumer error for ${tagName}:`, error)
				throw error
			})
		})
	}

	return updatedImportContext
}

export function ensureEndingQueue(params: {
	tagName: AvailableTagName
	importContext: ImportContext
}): ImportContext {
	const { tagName, importContext } = params
	const updatedImportContext = {
		...importContext,
	}
	let currentQueue = importContext.endingQueues[tagName]

	if (!currentQueue) {
		const newQueue = createAsyncQueue<DatabaseRecord>({
			batchSize: importContext.options.batchSize,
		})

		updatedImportContext.endingQueues[tagName] = newQueue
	}

	return updatedImportContext
}

export function closeAllQueues(params: { importContext: ImportContext }): ImportContext {
	const { importContext } = params
	let updatedImportContext = { ...importContext }

	for (const tagName of Object.keys(updatedImportContext.queues) as AvailableTagName[])
		updatedImportContext.queues[tagName]?.close()

	const unsubscribe = updatedImportContext.queuesObservable.subscribe(async () => {
		updatedImportContext = await createRemainingTablesAndFireEndingQueues({
			importContext: updatedImportContext,
		})
		unsubscribe()
	})

	return updatedImportContext
}

export function areAllQueuesDone(params: { importContext: ImportContext }) {
	const { importContext } = params
	const hasEndingQueues =
		importContext.endingQueues && Object.keys(importContext.endingQueues).length > 0

	return Promise.all([
		new Promise<void>((resolve) => {
			const unsubscribe = importContext.queuesObservable.subscribe(() => {
				if (importContext.queuesObservable.isAllDone()) {
					unsubscribe()
					resolve()
				}
			})
		}),
		hasEndingQueues
			? new Promise<void>((resolve) => {
					const unsubscribe = importContext.endingQueuesObservable.subscribe(() => {
						if (importContext.endingQueuesObservable.isAllDone()) {
							unsubscribe()
							resolve()
						}
					})
				})
			: Promise.resolve(),
	])
}

async function createRemainingTablesAndFireEndingQueues(params: { importContext: ImportContext }) {
	const { importContext } = params
	const updatedImportContext = { ...importContext }

	await bulkCreateTables({
		databaseInstance: importContext.databaseInstance,
		tagNames: Object.keys(importContext.endingQueues),
	})

	for (const tagName of Object.keys(updatedImportContext.endingQueues)) {
		const currentQueue = updatedImportContext.endingQueues[tagName]
		if (!currentQueue) throw new Error(`Ending queue for tagName ${tagName} is not defined`)

		updatedImportContext.endingQueues[tagName]?.close()
		queueMicrotask(() => {
			consumeQueueAndSaveToDatabase({
				tagName,
				importContext: updatedImportContext,
				isEndingQueue: true,
			}).catch((error) => {
				console.error(`Consumer error for ${tagName}:`, error)
				throw error
			})
		})
	}

	return updatedImportContext
}

export function createQueuesObservable(queues: Partial<Queues>): QueueObservable {
	const listeners = new Set<() => void>()

	function subscribe(listener: () => void) {
		listeners.add(listener)

		const unsubscribe = () => listeners.delete(listener)

		return unsubscribe
	}

	function notify() {
		for (const listener of listeners) listener()
	}

	function isAllDone() {
		return Object.values(queues).every((queue) => queue.status === 'done')
	}

	return { subscribe, notify, isAllDone }
}

//====== PRIVATE FUNCTIONS ======//

async function consumeQueueAndSaveToDatabase(params: {
	tagName: AvailableTagName | string
	importContext: ImportContext
	isEndingQueue: boolean
}) {
	const { tagName, importContext, isEndingQueue } = params

	let currentQueues: Queues | EndingQueues
	let currentQueuesObservable: QueueObservable

	if (isEndingQueue) {
		currentQueues = importContext.endingQueues as EndingQueues
		currentQueuesObservable = importContext.endingQueuesObservable
	} else {
		currentQueues = importContext.queues as Queues
		currentQueuesObservable = importContext.queuesObservable
	}

	if (!isTagNameInQueues(tagName, currentQueues) || !currentQueues[tagName])
		throw new Error(`Queue for tagName ${tagName} is not defined to be consumed`)

	while (true) {
		const { value: elementsBatch, done } = await currentQueues[tagName].next()

		if (done) {
			if (currentQueuesObservable.isAllDone()) currentQueuesObservable.notify()
			break
		}

		if (elementsBatch.length === 0) continue

		const elementsBatchWithResolvedRelationships = resolveCurrentBatchChildrenRelationships({
			parentRecordsBatch: elementsBatch,
			// within the same batch, all records have the same tagName
			parentTagName: elementsBatch[0].tagName,
		})

		await bulkAddRecords({
			databaseInstance: importContext.databaseInstance,
			tagName,
			records: elementsBatchWithResolvedRelationships,
		})
	}
}
