import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

beforeEach(() => {
	setActivePinia(createPinia())
})

describe('useCounterStore', () => {
	it('should initialize count with 0', () => {
		const counter = useCounterStore()
		expect(counter.count).toBe(0)
	})

	it('should increment count by 1', () => {
		const counter = useCounterStore()
		counter.increment()
		expect(counter.count).toBe(1)
	})

	it('should double count correctly', () => {
		const counter = useCounterStore()
		expect(counter.doubleCount).toBe(0)
		counter.increment()
		expect(counter.doubleCount).toBe(2)
	})
})
