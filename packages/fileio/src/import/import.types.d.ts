import type { AvailableTagName } from '@/common/common.types'
import type { createAsyncQueue } from './import.queue'

export type ImportOptions = {
	useBrowserApi: boolean
	chunkSize: number
	batchSize: number
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

export type QueueResult = { value: T[]; done: boolean }
export type ResolverFunction = (value: QueueResult) => void
export type AsyncQueue<T> = ReturnType<typeof createAsyncQueue<T>>
