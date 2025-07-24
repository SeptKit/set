import type { AvailableTagName, DatabaseRecord } from '@/common/common.types'

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
	currentId: string
	currentTagName: '' | AvailableTagName
	currentValue: string
	currentParentElements: Array<{ id: string; tagName: AvailableTagName }>
	recordsBatch: Record<string, DatabaseRecord[]>
	relationshipsBatch: Record<ParentTagName, NewRelationship[]>
	tablesToCreate: AvailableTagName[]
}

//====== QUEUE

export type Queues = Record<
	AvailableTagName,
	{ status: 'pending' | 'done'; instance: CreateAsyncQueue }
>

export type QueueResult = { value: DatabaseRecord[]; done: boolean }
export type ResolverFunction = (value: QueueResult) => void
export type CreateAsyncQueue = {
	push: (item: DatabaseRecord) => void
	next: () => Promise<QueueResult>
	close: () => void
}
