import { render } from 'vitest-browser-vue'
import { expect, test, vi } from 'vitest'
import app from './app.vue'

const testApi = {
	activeFileName: {
		subscribe: vi.fn(),
	},
}

test('renders the line "template"', async () => {
	const screen = render(app, { props: { api: testApi } })

	await expect.element(screen.getByText('Structure')).toBeVisible()
})
