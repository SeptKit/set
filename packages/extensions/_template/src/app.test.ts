import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the line "template"', async () => {
	const screen = render(app)

	await expect.element(screen.getByText('__TEMPLATE__')).toBeVisible()
})
