import { expect, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import DataflowVisualisation from './dataflow-visualisation.vue'
import type { LNode } from './lnode'

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
]

describe('DataflowVisualisation', () => {
	it('renders two visualised nodes with the select LNode placeholder', async () => {
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
	describe('LNode select', () => {
		it('renders select options for LNodes and updates displayed label when selected', async () => {
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
})
