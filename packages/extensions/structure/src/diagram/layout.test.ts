import { describe, it } from 'vitest'
import { useLayout } from './layout'
import type { Edge, Node } from '@vue-flow/core'

describe('Component', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			nodes: Node[]
			edges: Edge[]
			only?: boolean
		}

		const featureTests: TestCase[] = [
			{
				desc: 'first test',
				nodes: [
					{
						id: '1',
						type: 'input',
						data: { label: 'Node 1' },
						position: { x: 0, y: 0 },
						class: 'light',
					},
					{
						id: '2',
						type: 'input',
						data: { label: 'Node 2' },
						position: { x: 0, y: 0 },
						class: 'light',
					},
				],
				edges: [
					{
						id: 'e1-2',
						source: '1',
						target: '2',
						animated: true,
					},
				],
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
				// Arrange
				const { calcLayout } = useLayout()

				// Action
				const nodes = await calcLayout(tc.nodes, tc.edges)

				// Assert
				console.log({ nodes })
			})
		}
	})
})
