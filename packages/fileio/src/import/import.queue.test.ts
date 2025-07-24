import { describe, expect, it } from 'vitest'
import { createAsyncQueue } from './async-queue/async-queue'
import { AsyncQueue } from './async-queue/async-queue.type'

describe('Async Queue', () => {
	describe('batch sizes', () => {
		type TestCase = {
			desc: string
			itemsToPush: string[]
			itemsToExpect: string[]
			batchSize: number
		}

		const featureTests: TestCase[] = [
			{
				desc: 'pushing as many elements as the batch size',
				itemsToPush: ['A', 'B', 'C', 'D'],
				itemsToExpect: ['A', 'B', 'C', 'D'],
				batchSize: 4,
			},
			{
				desc: 'pushing less items then the batch size',
				itemsToPush: ['A', 'B', 'C', 'D'],
				itemsToExpect: ['A', 'B', 'C', 'D'],
				batchSize: 5,
			},
			{
				desc: 'pushing more items then the batch size',
				itemsToPush: ['A', 'B', 'C', 'D'],
				itemsToExpect: ['A', 'B', 'C', 'D'],
				batchSize: 2,
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				const aq = createAsyncQueue<string>({ batchSize: tc.batchSize })

				// Act
				startProducer(aq, tc.itemsToPush)
				const items = await startWorker(aq)

				// Assert
				expect(items).toEqual(tc.itemsToExpect)

				async function startWorker(q: AsyncQueue<string>) {
					const items = []
					while (true) {
						const { done, value } = await q.next()
						if (done) {
							break
						}
						items.push(...value)
					}
					return items
				}

				async function startProducer(q: AsyncQueue<string>, itemsToPush: string[]) {
					for (const item of itemsToPush) {
						q.push(item)
					}
					q.close()
				}
			})
		}
	})
})
