import { describe, expect, it } from 'vitest'
import { useLayout, type Connection } from './layout'
import type { Node } from '@vue-flow/core'
import type { DatabaseRecord } from '@septkit/fileio'

describe('Component', () => {
	describe('layout calculations', () => {
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
				const layout = useLayout()
				layout.setRecords(tc.records)

				// Action
				await layout.calcLayout()

				// Assert

				// Note: we remove all the data except the label
				// because currently they are calculated
				// and we cannot use them in a deterministic way
				const nodes = layout.flowNodes.value
				nodes.forEach((node) => {
					for (const key of Object.keys(node.data)) {
						if (key === 'label') {
							continue
						}
						delete node.data[key]
					}
				})
				expect(nodes, 'nodes: ' + JSON.stringify(nodes, undefined, 2)).toEqual(
					expect.arrayContaining(
						tc.expectedPartialFlowNodes.map((expNode) => expect.objectContaining(expNode)),
					),
				)
			})
		}
	})
	describe('expanding and collapsing nodes', () => {
		type TestCase = {
			desc: string
			only?: boolean
			records: DatabaseRecord[]
			toggleNodeIds: string[]
			expectedVisibleFlowNodes: Partial<Node>[]
			expectedHiddenFlowNodes: Partial<Node>[]
		}

		const featureTests: TestCase[] = [
			{
				desc: 'toggling an opened node, closes it and hides the children',
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
				],
				toggleNodeIds: ['1'],
				expectedVisibleFlowNodes: [
					{
						id: '1',
						data: { label: 'TEMPLATE' },
					},
				],
				expectedHiddenFlowNodes: [
					{
						id: '2',
						data: { label: 'TEMPLATE' },
					},
				],
			},
			{
				desc: 'toggling a closed node, openes it and shows it children',
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
				],
				toggleNodeIds: ['1', '1'],
				expectedVisibleFlowNodes: [
					{
						id: '1',
						data: { label: 'TEMPLATE' },
					},
					{
						id: '2',
						data: { label: 'TEMPLATE' },
					},
				],
				expectedHiddenFlowNodes: [],
			},
			{
				desc: 'closing a node hides grandchilrend too',
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
				toggleNodeIds: ['1'],
				expectedVisibleFlowNodes: [
					{
						id: '1',
						data: { label: 'TEMPLATE' },
					},
				],
				expectedHiddenFlowNodes: [
					{
						id: '2',
						data: { label: 'TEMPLATE' },
					},
					{
						id: '3',
						data: { label: 'TEMPLATE' },
					},
				],
			},
			{
				desc: 'a nodes keeps its expanded/collapse state even if its parent not gets collapsed and expanded',
				only: true,
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
				toggleNodeIds: ['2', '1', '1'],
				expectedVisibleFlowNodes: [
					{
						id: '1',
						data: { label: 'TEMPLATE' },
					},
					{
						id: '2',
						data: { label: 'TEMPLATE' },
					},
				],
				expectedHiddenFlowNodes: [
					{
						id: '3',
						data: { label: 'TEMPLATE' },
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
				const layout = useLayout()
				layout.setRecords(tc.records)
				await layout.calcLayout()

				// Action
				for (const nodeId of tc.toggleNodeIds) {
					await layout.toggleNode(nodeId)
				}

				// Assert

				// Note: we remove all the data except the label
				// because currently they are calculated
				// and we cannot use them in a deterministic way
				const nodes = layout.flowNodes.value
				nodes.forEach((node) => {
					for (const key of Object.keys(node.data)) {
						if (key === 'label') {
							continue
						}
						delete node.data[key]
					}
				})
				expect(nodes, 'nodes: ' + JSON.stringify(nodes, undefined, 2)).toEqual(
					expect.arrayContaining(
						tc.expectedVisibleFlowNodes.map((expNode) => expect.objectContaining(expNode)),
					),
				)

				for (const hiddenFlowNodes of tc.expectedHiddenFlowNodes) {
					const expectation = expect.arrayContaining([expect.objectContaining(hiddenFlowNodes)])

					const debugAllNodes = `nodes: \n${JSON.stringify(nodes, undefined, 2)}`
					const debugExpectation = `expectation (unexpected nodes): \n${JSON.stringify(expectation, undefined, 2)}`
					const debugMsg = [debugAllNodes, debugExpectation].join('\n')

					expect(nodes, debugMsg).not.toEqual(expectation)
				}
			})
		}
	})
})
