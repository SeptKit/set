import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the headline "SET"', async () => {
	const screen = render(app)

	await expect.element(screen.getByText('SET')).toBeVisible()
})
