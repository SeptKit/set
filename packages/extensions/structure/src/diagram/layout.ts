import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode, Edge as FlowEdge } from '@vue-flow/core'

// Note: this is a usefull function to print out
// all the possible configuration of elk into the console
// @ts-expect-error
window.printElkInfo = printElkInfo

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

		const elkNodesFlat = nodes.map(flowNodeToElkNode)
		const elkNodes = setupRelationships(elkNodesFlat)
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
		const newElkNodesFlat = flattenElkNodes(rootNode.children)
		const newFlowNodes = newElkNodesFlat.map(elkNodeToFlowNode)

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

function setupRelationships(nodes: CombinedNode[]) {
	const nodeMapById = nodes.reduce((nodeMap: { [nodeId: string]: CombinedNode }, node) => {
		nodeMap[node.id] = node

		return nodeMap
	}, {})

	const nodesWithChildren: CombinedNode[] = []
	for (const nodeId of Object.keys(nodeMapById)) {
		const node = nodeMapById[nodeId]
		const parentId = node.flowNode.parentNode
		if (!parentId) {
			nodesWithChildren.push(node)
			continue
		}

		const parentNode = nodeMapById[parentId]
		if (!parentNode) {
			console.warn('there was a parent id but could not find the parent node, moving on', parentId)
			continue
		}

		if (!parentNode.children) {
			parentNode.children = []
		}

		parentNode.children.push(node)
	}

	return nodesWithChildren
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
 */
function elkNodeToFlowNode(elkNode: CombinedNode): FlowNode {
	return {
		...elkNode.flowNode,
		position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
		style: { width: `${elkNode.width}px`, height: `${elkNode.height}px` },
		// id: elkNode.id,
		// type: 'input',
		// data: { label: elkNode.flowNode.data.label },
		// class: elkNode.flowNode.class,
	}
}

function flattenElkNodes(elkNodes: CombinedNode[]): CombinedNode[] {
	const flattenedNodes: CombinedNode[] = []

	for (const node of elkNodes) {
		flattenedNodes.push(node)
		if (node.children) {
			const flattenedChildren = flattenElkNodes(node.children as CombinedNode[])
			flattenedNodes.push(...flattenedChildren)
		}
	}

	return flattenedNodes
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
