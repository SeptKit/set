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
				'elk.padding': '[top=35,right=10,bottom=10,left=10]',
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

function flowEdgeToElkEdge(flowEdge: FlowEdge): ElkExtendedEdge {
	return {
		id: flowEdge.id,
		sources: [flowEdge.source],
		targets: [flowEdge.target],
	}
}

function elkNodeToFlowNode(elkNode: CombinedNode): FlowNode {
	return {
		...elkNode.flowNode,
		data: {
			...elkNode.flowNode.data,
			width: elkNode.width,
			height: elkNode.height,
		},
		position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
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
