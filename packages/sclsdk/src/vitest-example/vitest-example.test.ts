import { describe, it, expect } from 'vitest'
import { sclSdkTestFunction } from './vitest-example'

describe('sclSdkTestFunction', () => {
	it('should return the correct test string', () => {
		const result = sclSdkTestFunction()
		expect(result).toBe('Test function for the scl-sdk package')
	})
})
