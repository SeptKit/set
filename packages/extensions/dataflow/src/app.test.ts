import { render } from 'vitest-browser-vue'
import { expect, test, vi } from 'vitest'
import app from './app.vue'

// Mock the DB so the component does not try to actually open or access a database
vi.mock('./assets/use-lnode-records', () => ({
	getEnrichedLNodesFromDB: vi.fn().mockResolvedValue([]),
}))

test('renders the line "Dataflow Extension', async () => {
	const activeFileName = 'testfile'
	localStorage.setItem('currentActiveFileDatabaseName', activeFileName)

	const screen = render(app, {
		props: {
			api: {
				activeFileName: {
					subscribe: vi.fn(),
				},
			},
		},
	})

	await expect.element(screen.getByText('Dataflow Extension')).toBeVisible()
})
