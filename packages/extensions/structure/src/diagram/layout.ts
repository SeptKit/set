import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode, Edge as FlowEdge } from '@vue-flow/core'

export function useLayout() {
	return {
		calcLayout,
	}

	async function calcLayout(nodes: FlowNode[], edges: FlowEdge[]): Promise<FlowNode[]> {
		const elk = new Elk()

		const elkNodes = nodes.map(flowNodeToElkNode)
		const elkEdges = edges.map(flowEdgeToElkEdge)

		const graph = {
			id: 'root',
			layoutOptions: { 'elk.algorithm': 'layered' },
			children: elkNodes,
			edges: elkEdges,
		}

		const rootNode = await elk.layout(graph)

		console.debug({ level: 'debug', msg: 'finished layout', elkNodes: rootNode.children })
		const newFlowNodes = rootNode.children?.map(elkNodeToFlowNode)

		return newFlowNodes ?? []
	}
}

// ElkNode: { id: "n1", width: 30, height: 30 },
// FlowNode:{
// 	id: '1',
// 	type: 'input',
// 	data: { label: 'Node 1' },
// 	position: { x: 250, y: 0 },
// 	class: 'light',
// },
function flowNodeToElkNode(flowNode: FlowNode): ElkNode {
	return {
		id: flowNode.id,
		width: 90,
		height: 30,
		labels: [{ text: flowNode.data.label }],
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
function flowEdgeToElkEdge(flowEdge: FlowEdge): ElkExtendedEdge & { customData: unknown } {
	return {
		id: flowEdge.id,
		sources: [flowEdge.source],
		targets: [flowEdge.target],
		customData: { animated: true },
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
function elkNodeToFlowNode(elkNode: ElkNode): FlowNode {
	return {
		id: elkNode.id,
		type: 'input',
		data: { label: extractLabel(elkNode) },
		position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
		class: 'light',
	}
}

function extractLabel(elkNode: ElkNode): string {
	const noLabel = '<no label>'
	const hasLabel = elkNode.labels && elkNode.labels.length > 0
	if (!hasLabel) {
		return noLabel
	}

	const label = elkNode.labels![0].text
	if (label === undefined) {
		return noLabel
	}

	return label
}
