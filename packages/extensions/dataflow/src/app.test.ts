import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the line "Dataflow Extension', async () => {
	const screen = render(app)

	await expect.element(screen.getByText('Dataflow Extension')).toBeVisible()
})
