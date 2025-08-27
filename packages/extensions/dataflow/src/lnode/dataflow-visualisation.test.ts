import { expect, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import DataflowVisualisation from './dataflow-visualisation.vue'
import type { LNode } from './lnode'
import { DataflowType, type Connection } from './connection'

const mockLNodes: LNode[] = [
	{
		id: '1',
		uuid: 'uuid-1',
		iedName: 'IED1',
		lnType: 'LT1',
		prefix: 'P',
		lnClass: 'XCBR',
		lnInst: '1',
		dataObjects: [
			{
				id: 'do1',
				uuid: 'uuid-do1',
				name: 'Beh',
				dataAttributes: [
					{ id: 'da1', uuid: 'uuid-da1', name: 'stVal', dataObjectId: 'do1', fc: 'ST' },
					{ id: 'da2', uuid: 'uuid-da2', name: 'q', dataObjectId: 'do1', fc: 'ST' },
				],
				lNodeId: '1',
			},
			{
				id: 'do2',
				uuid: 'uuid-do2',
				name: 'Pos',
				dataAttributes: [
					{ id: 'da3', uuid: 'uuid-da3', name: 'ctlVal', dataObjectId: 'do2', fc: 'CO' },
				],
				lNodeId: '1',
			},
		],
		dataObjectSpecifications: [
			{
				id: 'dos1',
				name: 'MySpec1',
				desc: 'Desc1',
				dataAttributeSpecifications: [
					{ id: 'das1', name: 'SpecAttr1', desc: 'dummy', dataObjectSpecificationId: 'dos1' },
				],
				lNodeId: '1',
			},
		],
	},
	{
		id: '2',
		uuid: 'uuid-2',
		iedName: 'IED2',
		lnType: 'LT2',
		prefix: 'Q',
		lnClass: 'PTRC',
		lnInst: '2',
		dataObjects: [
			{
				id: 'do3',
				uuid: 'uuid-do3',
				name: 'OpCnt',
				dataAttributes: [
					{ id: 'da4', uuid: 'uuid-da4', name: 'opVal', dataObjectId: 'do3', fc: 'CO' },
				],
				lNodeId: '2',
			},
		],
		dataObjectSpecifications: [
			{
				id: 'dos2',
				name: 'MySpec2',
				desc: 'Desc2',
				dataAttributeSpecifications: [
					{ id: 'das2', name: 'SpecAttr2', desc: 'dummy', dataObjectSpecificationId: 'dos2' },
				],
				lNodeId: '2',
			},
		],
	},
	{
		id: '3',
		uuid: 'uuid-3',
		iedName: 'IED3',
		lnType: 'LT3',
		prefix: 'R',
		lnClass: 'PIOC',
		lnInst: '3',
		dataObjects: [
			{
				id: 'do4',
				uuid: 'uuid-do4',
				name: 'Beh',
				dataAttributes: [
					{ id: 'da5', uuid: 'uuid-da5', name: 'strVal', dataObjectId: 'do4', fc: 'ST' },
				],
				lNodeId: '3',
			},
		],
		dataObjectSpecifications: [
			{
				id: 'dos3',
				name: 'MySpec3',
				desc: 'Desc3',
				dataAttributeSpecifications: [
					{ id: 'das3', name: 'SpecAttr3', desc: 'dummy', dataObjectSpecificationId: 'dos3' },
				],
				lNodeId: '3',
			},
		],
	},
]

const mockConnections: Connection[] = [
	{
		sourceLNodeId: '1',
		destinationLNodeId: '2',
		sourceDataObject: 'Beh',
		sourceDataAttribute: 'stVal',
		dataflowType: DataflowType.GOOSE,
		inputInstance: '1',
		input: 'Beh',
	},
	{
		sourceLNodeId: '1',
		destinationLNodeId: '3',
		sourceDataObject: 'Pos',
		sourceDataAttribute: 'ctlVal',
		dataflowType: DataflowType.SMV,
		inputInstance: '1',
		input: 'Pos',
	},
	{
		sourceLNodeId: '2',
		destinationLNodeId: '3',
		sourceDataObject: 'OpCnt',
		sourceDataAttribute: 'opVal',
		dataflowType: DataflowType.INTERNAL,
		inputInstance: '1',
		input: 'OpCnt',
	},
]

describe('DataflowVisualisation', () => {
	describe('LNode select', () => {
		it('renders two node select inputs with the "Select LNode" placeholder', () => {
			// Arrange
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: [],
				},
			})

			// Act: Find all dropdown/select placeholder texts
			const selectLNodeCount = (container.textContent?.match(/Select LNode/g) || []).length

			// Assert:  that there are two visual nodes with the placeholder
			expect(selectLNodeCount).toBe(2)
		})
		it('renders select options for LNodes and updates displayed label when selected', () => {
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: [],
				},
			})

			const select: HTMLSelectElement = container.querySelector('select')!
			const options = Array.from(select.options)

			expect(select).toBeTruthy()
			expect(options.some((opt) => opt.textContent === 'P XCBR 1')).toBe(true)
			expect(options.some((opt) => opt.textContent === 'Q PTRC 2')).toBe(true)
		})

		it('selecting another LNode shows its label', async () => {
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: [],
				},
			})

			const select: HTMLSelectElement = container.querySelector('select')!
			// Simulate selecting the second option
			select.value = mockLNodes[1].id
			select.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			// Headline should display selected LNode label
			expect(container.textContent).toContain('Q PTRC 2')
		})
	})
	describe('Connections', () => {
		it('renders no connections if no LNode selected', () => {
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: mockConnections,
				},
			})

			expect(container.querySelector('[data-testid^="dataflow-line-"]')).toBeNull()
		})
		it('renders no connections if only one LNode selected', async () => {
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: mockConnections,
				},
			})

			const selectInputs = container.querySelectorAll('select')!

			expect(selectInputs.length).toBe(2)

			// Simulate selecting the first LNode option in the first select input
			const firstSelect: HTMLSelectElement = selectInputs[0]!
			firstSelect.value = mockLNodes[0].id
			firstSelect.dispatchEvent(new Event('change'))

			await new Promise((r) => setTimeout(r, 0))

			expect(container.querySelector('[data-testid^="dataflow-line-"]')).toBeNull()
		})
		it('only renders connections filtered by the two selected LNodes', async () => {
			const { container } = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: mockConnections,
				},
			})

			const selectInputs = container.querySelectorAll('select')!

			expect(selectInputs.length).toBe(2)

			// Simulate selecting the first LNode option in the source LNode select input
			const sourceLNodeSelect: HTMLSelectElement = selectInputs[0]!
			sourceLNodeSelect.value = mockLNodes[0].id
			sourceLNodeSelect.dispatchEvent(new Event('change'))

			// Simulate selecting the second LNode option in the destination LNode select input
			const destinationLNodeSelect: HTMLSelectElement = selectInputs[1]!
			destinationLNodeSelect.value = mockLNodes[1].id
			destinationLNodeSelect.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			expect(container.querySelectorAll('[data-testid^="dataflow-line-"]')).toHaveLength(1)

			// Simulate selecting the third LNode option in the destination LNode select input
			destinationLNodeSelect.value = mockLNodes[2].id
			destinationLNodeSelect.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			expect(container.querySelectorAll('[data-testid^="dataflow-line-"]')).toHaveLength(1)

			// Simulate selecting the second LNode option in the source LNode select input
			sourceLNodeSelect.value = mockLNodes[1].id
			sourceLNodeSelect.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			expect(container.querySelectorAll('[data-testid^="dataflow-line-"]')).toHaveLength(1)

			// Simulate selecting the first LNode option in the destination LNode select input
			destinationLNodeSelect.value = mockLNodes[0].id
			destinationLNodeSelect.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			expect(container.querySelectorAll('[data-testid^="dataflow-line-"]')).toHaveLength(0)
		})
		it('renders connections with correct labels', async () => {
			const screen = render(DataflowVisualisation, {
				props: {
					lnodes: mockLNodes,
					connections: mockConnections,
				},
			})

			const selectInputs = screen.container.querySelectorAll('select')!

			expect(selectInputs.length).toBe(2)

			// Simulate selecting the first LNode option in the source LNode select input
			const sourceLNodeSelect: HTMLSelectElement = selectInputs[0]!
			sourceLNodeSelect.value = mockLNodes[0].id
			sourceLNodeSelect.dispatchEvent(new Event('change'))

			// Simulate selecting the second LNode option in the destination LNode select input
			const destinationLNodeSelect: HTMLSelectElement = selectInputs[1]!
			destinationLNodeSelect.value = mockLNodes[1].id
			destinationLNodeSelect.dispatchEvent(new Event('change'))
			await new Promise((r) => setTimeout(r, 0))

			expect(screen.container.querySelectorAll('[data-testid^="dataflow-line-"]')).toHaveLength(1)

			// Check that the connection labels are rendered correctly
			expect(screen.getByText('GOOSE')).toBeInTheDocument()
			const behElements = Array.from(screen.container.querySelectorAll('*')).filter(
				(el) => el.textContent === 'Beh',
			)
			expect(behElements).toHaveLength(2)

			expect(screen.getByText('stVal')).toBeInTheDocument()
			expect(screen.getByText('1', { exact: true })).toBeInTheDocument()
		})
	})
})
