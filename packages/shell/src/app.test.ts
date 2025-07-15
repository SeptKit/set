import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the line "main area"', async () => {
	const screen = render(app)

	await expect.element(screen.getByText('main area')).toBeVisible()
})
