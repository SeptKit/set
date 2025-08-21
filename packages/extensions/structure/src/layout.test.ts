import { describe, expect, it } from 'vitest'
import { useLayout, type Connection } from './layout'
import type { Node } from '@vue-flow/core'
import type { DatabaseRecord } from '@septkit/fileio'

describe('Component', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			records: DatabaseRecord[]
			connections: Connection[]
			only?: boolean
			expectedPartialFlowNodes: Partial<Node>[]
		}

		const featureTests: TestCase[] = [
			{
				desc: 'nodes with children',
				records: [
					{
						id: '1',
						tagName: 'Substation',
						namespace: null,
						attributes: [{ name: 'name', value: 'TEMPLATE' }],
						value: null,
						parent: null,
						children: [{ id: '2', tagName: 'VoltageLevel' }],
					},
					{
						id: '2',
						tagName: 'VoltageLevel',
						namespace: null,
						attributes: [{ name: 'name', value: 'TEMPLATE' }],
						value: null,
						parent: { id: '1', tagName: 'Substation' },
						children: [{ id: '3', tagName: 'Bay' }],
					},
					{
						id: '3',
						tagName: 'Bay',
						namespace: null,
						attributes: [{ name: 'name', value: 'TEMPLATE' }],
						value: null,
						parent: { id: '2', tagName: 'VoltageLevel' },
						children: [],
					},
				],
				connections: [],
				expectedPartialFlowNodes: [
					{
						id: '1',
						data: { label: 'TEMPLATE' },
					},
					{
						id: '2',
						data: { label: 'TEMPLATE' },
						parentNode: '1',
					},
					{
						id: '3',
						data: { label: 'TEMPLATE' },
						parentNode: '2',
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
				const nodes = await calcLayout(tc.records, tc.connections)

				// Assert

				// Note: we remove all the data expect the label
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
