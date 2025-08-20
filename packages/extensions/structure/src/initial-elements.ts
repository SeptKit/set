import { MarkerType, type Node } from '@vue-flow/core'

export const initialNodes: Node[] = [
	{
		id: '1',
		type: 'input',
		data: { label: 'TEMPLATE' },
		position: { x: 0, y: 0 },
		class: 'light',
	},
	{
		id: '2',
		type: 'output',
		data: { label: 'TEMPLATE' },
		position: { x: 0, y: 0 },
		class: 'light',
		parentNode: '1',
	},
	{
		id: '3',
		data: { label: 'TEMPLATE' },
		position: { x: 0, y: 0 },
		class: 'light',
		parentNode: '2',
	},
	{
		id: '4',
		data: { label: 'PROT interface' },
		position: { x: 150, y: 200 },
		class: 'light',
		parentNode: '3',
	},
	{
		id: '5',
		type: 'output',
		data: { label: 'Output Conditioner' },
		position: { x: 300, y: 300 },
		class: 'light',
		parentNode: '3',
	},
	{
		id: '6',
		type: 'output',
		data: { label: 'Binary Output' },
		position: { x: 300, y: 300 },
		class: 'light',
		parentNode: '3',
	},
]

export const initialEdges = [
	// {
	// 	id: 'e1-2',
	// 	source: '1',
	// 	target: '2',
	// 	animated: true,
	// },
	// {
	// 	id: 'e1-3',
	// 	source: '1',
	// 	target: '3',
	// 	label: 'edge with arrowhead',
	// 	markerEnd: MarkerType.ArrowClosed,
	// },
	// {
	// 	id: 'e4-5',
	// 	type: 'step',
	// 	source: '4',
	// 	target: '5',
	// 	label: 'Node 2',
	// 	style: { stroke: 'orange' },
	// 	labelBgStyle: { fill: 'orange' },
	// },
	// {
	// 	id: 'e3-4',
	// 	type: 'smoothstep',
	// 	source: '3',
	// 	target: '4',
	// 	label: 'smoothstep-edge',
	// },
]
