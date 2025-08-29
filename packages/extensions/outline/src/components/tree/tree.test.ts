import { describe, it } from 'vitest'
import Tree from './tree.vue'
import { render } from 'vitest-browser-vue'

describe('Component', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			only?: boolean
		}

		const featureTests: TestCase[] = [
			{
				desc: 'first test',
			},
		]

		let testCases = featureTests
		let runOnlyTestCases = featureTests.filter((tc) => tc.only)
		if (runOnlyTestCases.length) {
			testCases = runOnlyTestCases
		}

		testCases.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				const screen = await render(Tree)
			})
		}
	})
})
