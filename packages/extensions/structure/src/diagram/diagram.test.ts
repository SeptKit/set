import { describe, expect, it } from 'vitest'
import type { Edge, Node } from '@vue-flow/core'
import { createPinia, setActivePinia } from 'pinia'
import Diagram from './diagram.vue'
import { render } from 'vitest-browser-vue'

describe('Diagram', () => {
	describe('Rendering', () => {
		type TestCase = {
			desc: string
			nodes: Node[]
			edges: Edge[]
			expectedNodeLabels: string[]
			expectedEdgeLabels: string[]
			only?: boolean
		}

		const featureTests: TestCase[] = [
			{
				desc: 'display nodes',
				nodes: [
					{
						id: '1',
						type: 'input',
						data: { label: 'Node 1' },
						position: { x: 250, y: 0 },
					},
					{
						id: '2',
						type: 'input',
						data: { label: 'Node 2' },
						position: { x: 250, y: 0 },
					},
				],
				edges: [],
				expectedNodeLabels: ['Node 1', 'Node 2'],
				expectedEdgeLabels: [],
			},
			{
				desc: 'display nodes and edges',
				nodes: [
					{
						id: '1',
						type: 'input',
						data: { label: 'Node 1' },
						position: { x: 250, y: 0 },
					},
					{
						id: '2',
						type: 'input',
						data: { label: 'Node 2' },
						position: { x: 250, y: 0 },
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
				expectedNodeLabels: ['Node 1', 'Node 2'],
				expectedEdgeLabels: ['Edge from 1 to 2'],
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
				setActivePinia(createPinia())

				// Act
				const screen = render(Diagram, {
					props: {
						edges: tc.edges,
						nodes: tc.nodes,
					},
				})

				// Assert
				for (const nodeLabel of tc.expectedNodeLabels) {
					await expect.element(screen.getByText(nodeLabel)).toBeVisible()
				}
				for (const edgeLabel of tc.expectedEdgeLabels) {
					await expect
						.element(screen.container.querySelector(`[aria-label="${edgeLabel}"]`))
						.toBeInTheDocument()
				}
			})
		}
	})
})
