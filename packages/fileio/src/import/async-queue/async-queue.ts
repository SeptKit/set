import { AsyncQueue, QueueResult, ResolverFunction } from './async-queue.type'

export function createAsyncQueue<T>(params: { batchSize: number }): AsyncQueue<T> {
	const _batchSize = params.batchSize
	let _queue: T[] = []
	let _closed = false
	let _nextResolve: ResolverFunction<T> | undefined = undefined

	return { push, next, close }

	// When a consumer wants data but none is available,
	// a "resolver" is created and stored.
	// When data is pushed, the resolver is called with the data.
	async function next(): Promise<QueueResult<T>> {
		const closedWithoutData = _queue.length === 0 && _closed
		if (closedWithoutData) {
			return Promise.resolve({ value: [], done: true })
		}

		const closedButHasData = _closed && _queue.length > 0
		const isDataAvailable = _queue.length >= _batchSize

		if (closedButHasData || isDataAvailable) {
			const elementsBatch = _queue.splice(0, _batchSize)
			return Promise.resolve({ value: elementsBatch, done: false })
		}

		const { resolve, promise } = Promise.withResolvers<QueueResult<T>>()
		_nextResolve = resolve
		return promise
	}

	// When a producer adds data, they check if any consumers are waiting
	function push(item: T) {
		const isBatchReached = _queue.length >= _batchSize

		if (isBatchReached && _nextResolve) {
			const elementsBatch = _queue.splice(0, _batchSize)
			_nextResolve({ value: elementsBatch, done: false })
			_nextResolve = undefined
		}

		_queue.push(item)
	}

	function close(): void {
		_closed = true
		if (_nextResolve) {
			const elementsBatch = _queue.splice(0, _batchSize)
			_nextResolve({ value: elementsBatch, done: false })
			_nextResolve = undefined
		}
	}
}
