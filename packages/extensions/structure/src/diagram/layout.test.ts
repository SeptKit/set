import { describe, expect, it } from 'vitest'
import { useLayout } from './layout'
import type { Edge, Node } from '@vue-flow/core'

describe('Component', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			nodes: Node[]
			edges: Edge[]
			only?: boolean
			expectedPartialFlowNodes: Partial<Node>[]
		}

		const featureTests: TestCase[] = [
			{
				desc: 'two nodes connected',
				nodes: [
					{
						id: '1',
						data: { label: 'Node 1' },
						position: { x: 0, y: 0 },
					},
					{
						id: '2',
						data: { label: 'Node 2' },
						position: { x: 0, y: 0 },
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
				expectedPartialFlowNodes: [
					{
						id: '1',
						data: { label: 'Node 1' },
					},
					{
						id: '2',
						data: { label: 'Node 2' },
					},
				],
			},
			{
				desc: 'single level of children nodes',
				nodes: [
					{
						id: '1',
						data: { label: 'Parent' },
						position: { x: 0, y: 0 },
					},
					{
						id: '2',
						data: { label: 'Child' },
						position: { x: 0, y: 0 },
						parentNode: '1',
					},
				],
				edges: [],
				expectedPartialFlowNodes: [
					{
						id: '1',
						data: { label: 'Parent' },
					},
					{
						id: '2',
						data: { label: 'Child' },
						parentNode: '1',
					},
				],
			},
			{
				desc: 'multiple level of nodes',
				nodes: [
					{
						id: '1',
						data: { label: 'Parent' },
						position: { x: 0, y: 0 },
					},
					{
						id: '2',
						data: { label: 'Child' },
						position: { x: 0, y: 0 },
						parentNode: '1',
					},
					{
						id: '3',
						data: { label: 'Child' },
						position: { x: 0, y: 0 },
						parentNode: '2',
					},
					{
						id: '4',
						data: { label: 'Child' },
						position: { x: 0, y: 0 },
						parentNode: '1',
					},
				],
				edges: [],
				expectedPartialFlowNodes: [
					{
						id: '1',
						data: { label: 'Parent' },
					},
					{
						id: '2',
						data: { label: 'Child' },
						parentNode: '1',
					},
					{
						id: '3',
						data: { label: 'Child' },
						parentNode: '2',
					},
					{
						id: '4',
						data: { label: 'Child' },
						parentNode: '1',
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

				// Note: we remoe all the data expect the label
				// because currently they are calculated
				// and we cannot use them in a deterministic way
				nodes.forEach((node) => {
					for (const key of Object.keys(node.data)) {
						if (key === 'label') {
							continue
						}
						delete node.data[key]
					}
				})
				expect(nodes, 'nodes:: ' + JSON.stringify(nodes, undefined, 2)).toEqual(
					expect.arrayContaining(
						tc.expectedPartialFlowNodes.map((expNode) => expect.objectContaining(expNode)),
					),
				)
			})
		}
	})
})
