import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import dataflowNode from '../components/dataflow-node.vue'
import { getLNodeLabel } from '@/types/lnode'
import type { LNode } from '@/types/lnode'

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
		// Render component with dummy lnodes
		const { container } = render(dataflowNode, {
			props: { lnodes: dummyLNodes, type: 'input', activeLNodeId: '' },
		})

		// Get the select element
		const select: HTMLSelectElement = container.querySelector('select')!
		expect(select).toBeTruthy()

		// All options as NodeList
		const options = Array.from(select.options)
		expect(options.some((opt) => opt.textContent === getLNodeLabel(dummyLNodes[0]))).toBe(true)
		expect(options.some((opt) => opt.textContent === getLNodeLabel(dummyLNodes[1]))).toBe(true)

		// Simulate selecting the second option
		select.value = dummyLNodes[1].id
		select.dispatchEvent(new Event('change'))

		// Headline should display selected LNode label
		await new Promise((r) => setTimeout(r, 0))

		expect(container.textContent).toContain(getLNodeLabel(dummyLNodes[1]))
	})
})
