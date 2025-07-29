import type { AvailableTagName, DatabaseRecord, DatabaseInstance } from '@/common/common.types'
import type { AsyncQueue } from './async-queue/async-queue.type'

export type ImportContext = {
	databaseInstance: DatabaseInstance
	options: QueueOptions
	queues: Partial<Queues>
	endingQueues: Partial<EndingQueues>
	queuesObservable: QueueObservable
	endingQueuesObservable: QueueObservable
}

//====== OPTIONS

export type QueueOptions = {
	batchSize: number
}

export type ReaderOptions = {
	chunkSize: number
}

export type ImportOptions = QueueOptions &
	ReaderOptions & {
		useBrowserApi: boolean
	}

//====== RELATIONSHIPS

export type NewRelationship = { parentId: string; childId: string; childTagName: string }

//====== PARSER

export type ParserState = {
	stack: DatabaseRecord[]
	currentParentElements: Array<{ id: string; tagName: AvailableTagName }>
}

//====== QUEUE

export type Queue = AsyncQueue<DatabaseRecord>

export type Queues = Record<AvailableTagName, Queue>
export type EndingQueues = Record<string, Queue>

export type QueueObservable = {
	subscribe: (listener: () => void) => () => boolean
	notify: () => void
	isAllDone: () => boolean
}
