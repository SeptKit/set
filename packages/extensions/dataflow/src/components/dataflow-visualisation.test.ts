import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import dataflowVisualisation from '../components/dataflow-visualisation.vue'

// Mock the DB so the component does not try to actually open or access a database
vi.mock('../assets/use-lnode-records', () => ({
	getEnrichedLNodesFromDB: vi.fn().mockResolvedValue([]),
}))

describe('dataflow-visualisation', () => {
	it('renders two visualised nodes with the select LNode placeholder', async () => {
		const { container } = render(dataflowVisualisation)

		// Find all dropdown/select placeholder texts
		const selectLNodeCount = (container.textContent?.match(/Select LNode/g) || []).length

		// Assert that there are two visual nodes with the placeholder
		expect(selectLNodeCount).toBe(2)
	})
})
