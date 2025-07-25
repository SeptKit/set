import type { AvailableTagName, DatabaseRecord } from '@/common/common.types'
import type { AsyncQueue } from './async-queue/async-queue.type'

export type ParserOptions = {
	batchSize: number
}

export type ImportOptions = ParserOptions & {
	useBrowserApi: boolean
	chunkSize: number
}

type ParentTagName = string
export type NewRelationship = { parentId: string; childId: string; childTagName: string }

export type State = {
	stack: DatabaseRecord[]
	currentParentElements: Array<{ id: string; tagName: AvailableTagName }>
}

//====== QUEUE
export type Queues = Record<
	AvailableTagName,
	{ status: 'pending' | 'done'; instance: AsyncQueue<DatabaseRecord> }
>
