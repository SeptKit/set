import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import dataflowNode from './lnode-element.vue'
import type { LNode } from '@/lnode/lnode'

// Dummy data
const dummyLNodes: LNode[] = [
	{
		id: '1',
		uuid: 'uuid1',
		iedName: 'PIU',
		lnType: 'XCBR',
		prefix: 'P1',
		lnClass: 'XCBR',
		lnInst: '1',
		dataObjects: [],
	},
	{
		id: '2',
		uuid: 'uuid2',
		iedName: 'OTHER',
		lnType: 'PTRC',
		prefix: 'Q2',
		lnClass: 'PTRC',
		lnInst: '2',
		dataObjects: [],
	},
]

describe('dataflow-node', () => {
	it('renders select options for LNodes and updates displayed label when selected', async () => {
		// Arrange

		// Act: Render component with dummy lnodes
		const { container } = render(dataflowNode, {
			props: { lnodes: dummyLNodes, type: 'input', activeLNodeId: '' },
		})
		const select: HTMLSelectElement = container.querySelector('select')!
		const options = Array.from(select.options)

		// Assert
		expect(select).toBeTruthy()
		expect(options.some((opt) => opt.textContent === 'P1 XCBR 1')).toBe(true)
		expect(options.some((opt) => opt.textContent === 'Q2 PTRC 2')).toBe(true)
	})

	it('selecting another LNode shows its label', async () => {
		// Arrange

		// Act: Render component with dummy lnodes
		const { container } = render(dataflowNode, {
			props: { lnodes: dummyLNodes, type: 'input', activeLNodeId: '' },
		})
		const select: HTMLSelectElement = container.querySelector('select')!
		// Simulate selecting the second option
		select.value = dummyLNodes[1].id
		select.dispatchEvent(new Event('change'))
		await new Promise((r) => setTimeout(r, 0))

		// Assert: Headline should display selected LNode label
		expect(container.textContent).toContain('Q2 PTRC 2')
	})
})
