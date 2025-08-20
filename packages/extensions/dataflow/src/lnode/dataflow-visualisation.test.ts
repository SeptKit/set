import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import dataflowVisualisation from './dataflow-visualisation.vue'
import type { LNodeSDK } from './lnode-database'

describe('dataflow-visualisation', () => {
	it('renders two visualised nodes with the select LNode placeholder', async () => {
		const { container } = render(dataflowVisualisation, {
			props: {
				lnodeSDK: createLNodeSDKMock(),
			},
		})

		// Find all dropdown/select placeholder texts
		const selectLNodeCount = (container.textContent?.match(/Select LNode/g) || []).length

		// Assert that there are two visual nodes with the placeholder
		expect(selectLNodeCount).toBe(2)
	})
	it('renders two visualised nodes with the select LNode placeholder', async () => {
		const { container } = render(dataflowVisualisation, {
			props: {
				lnodeSDK: createLNodeSDKMock(),
			},
		})

		// Find all dropdown/select placeholder texts
		const selectLNodeCount = (container.textContent?.match(/Select LNode/g) || []).length

		// Assert that there are two visual nodes with the placeholder
		expect(selectLNodeCount).toBe(2)
	})
})

function createLNodeSDKMock(): LNodeSDK {
	return {
		getEnrichedLNodesFromDB: () => {
			return Promise.resolve([])
		},
		enrichLNodesWithDataObjects: () => {
			return Promise.resolve([])
		},
		enrichLNodesWithDataAttributes: () => {
			return Promise.resolve([])
		},
		enrichLNodesWithDataObjectSpecifications: () => {
			return Promise.resolve([])
		},
		close: () => {},
	}
}
