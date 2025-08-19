import { render } from 'vitest-browser-vue'
import { expect, test, vi } from 'vitest'
import app from './app.vue'

// Mock the DB so the component does not try to actually open or access a database
vi.mock('./assets/use-lnode-records', () => ({
	getEnrichedLNodesFromDB: vi.fn().mockResolvedValue([]),
}))

test('renders the line "Dataflow Extension"', async () => {
	const screen = render(app)
	await expect.element(screen.getByText('Dataflow Extension')).toBeVisible()
})
