import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import HelloWorld from './hello-world.vue'

test('renders name', async () => {
	const { getByText } = render(HelloWorld, {
		props: { name: 'Vitest' },
	})
	await expect.element(getByText('Hello Vitest!')).toBeInTheDocument()
})
