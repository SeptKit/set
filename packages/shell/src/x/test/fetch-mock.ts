import { vi } from 'vitest'

let originalFetch: typeof fetch
export function mockNextFetch(returnObj: unknown) {
	originalFetch = fetch
	// @ts-expect-error: ignoring typeings
	window.fetch = vi.fn(() => {
		return Promise.resolve({
			json: () => {
				window.fetch = originalFetch
				return Promise.resolve(returnObj)
			},
			ok: true,
		})
	})
}
