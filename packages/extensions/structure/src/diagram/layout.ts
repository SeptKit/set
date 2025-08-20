import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode, Edge as FlowEdge } from '@vue-flow/core'

// Note: this is a usefull function to print out
// all the possible configuration of elk into the console
// printElkInfo()

export function useLayout() {
	return {
		calcLayout,
	}

	async function calcLayout(nodes: FlowNode[], edges: FlowEdge[]): Promise<FlowNode[]> {
		const elk = new Elk({
			defaultLayoutOptions: {
				'elk.algorithm': 'layered',
				'elk.spacing.nodeNode': '100',
			},
		})

		const elkNodes = nodes.map(flowNodeToElkNode)
		const elkEdges = edges.map(flowEdgeToElkEdge)
		// console.debug('mapped flow to elk', { edges, elkNodes, elkEdges })

		const graph: ElkNode = {
			id: 'root',
			children: elkNodes,
			edges: elkEdges,
		}

		const rootNode = (await elk.layout(graph)) as Omit<ElkNode, 'cildren'> & {
			children: CombinedNode[]
		}

		const newFlowNodes = rootNode.children?.map(elkNodeToFlowNode)

		return newFlowNodes ?? []
	}
}

export type CombinedNode = ElkNode & { flowNode: FlowNode }

// ElkNode: { id: "n1", width: 30, height: 30 },
// FlowNode:{
// 	id: '1',
// 	type: 'input',
// 	data: { label: 'Node 1' },
// 	position: { x: 250, y: 0 },
// 	class: 'light',
// },
function flowNodeToElkNode(flowNode: FlowNode): CombinedNode {
	return {
		id: flowNode.id,
		width: 150,
		height: 40,
		labels: [{ text: flowNode.data.label }],
		flowNode,
	}
}

/**
 *
 * flowEdge:
 * {
 *	id: 'e1-2',
 *	source: '1',
 *	target: '2',
 *	animated: true,
 *	},
 *
 * elkEdge:
 * { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
 */
function flowEdgeToElkEdge(flowEdge: FlowEdge): ElkExtendedEdge {
	return {
		id: flowEdge.id,
		sources: [flowEdge.source],
		targets: [flowEdge.target],
	}
}

/**
 *
 * elkNode
 * {
 *   "$H": 277,
 *   "height": 30,
 *   "id": "1",
 *   "width": 90,
 *   "x": 12,
 *   "y": 12,
 * },
 *
 * flowNode:
 * {
 * 	id: '1',
 * 	type: 'input',
 * 	data: { label: 'Node 1' },
 * 	position: { x: 0, y: 0 },
 * 	class: 'light',
 * },
 *
 *
 *
 *
 *
 * @param elkNode
 * @returns
 */
function elkNodeToFlowNode(elkNode: CombinedNode): FlowNode {
	return {
		id: elkNode.id,
		type: 'input',
		data: { label: elkNode.flowNode.data.label },
		position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
		class: elkNode.flowNode.class,
	}
}

async function printElkInfo() {
	const elk = new Elk()

	const algos = await elk.knownLayoutAlgorithms()
	const options = await elk.knownLayoutOptions()
	const cats = await elk.knownLayoutCategories()

	console.debug(
		'elk algos:',
		algos.map((a) => a.id),
	)

	console.debug(
		'elk options',
		options.map((o) => o.id),
	)

	console.debug(
		'elk cats',
		cats.map((c) => c.id),
	)
}
