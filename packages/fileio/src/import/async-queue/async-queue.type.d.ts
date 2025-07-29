export type QueueResult<T> = { value: T[]; done: boolean }
export type ResolverFunction<T> = (value: QueueResult<T>) => void
export type AsyncQueue<T> = {
	push: (item: T) => void
	next: () => Promise<QueueResult<T>>
	close: () => void
	status: 'pending' | 'done'
}
