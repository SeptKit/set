import dagre from '@dagrejs/dagre'
import { Position, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { ref } from 'vue'

export type Direction = 'TB' | 'BT' | 'LR' | 'RL'
/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout(diagramId: string) {
	const { findNode } = useVueFlow(diagramId)
	const graph = ref(new dagre.graphlib.Graph())
	const previousDirection = ref('LR')

	return { graph, layout, previousDirection }

	function layout(nodes: Node[], edges: Edge[], direction: Direction) {
		// we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
		const dagreGraph = new dagre.graphlib.Graph()

		graph.value = dagreGraph

		dagreGraph.setDefaultEdgeLabel(() => ({}))

		const isHorizontal = direction === 'LR'
		dagreGraph.setGraph({ rankdir: direction })

		previousDirection.value = direction

		for (const node of nodes) {
			// if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
			const graphNode = findNode(node.id)
			if (!graphNode) {
				console.warn({ msg: 'grap node not found', id: node.id })
				continue
			}

			dagreGraph.setNode(node.id, {
				width: graphNode.dimensions.width || 200,
				height: graphNode.dimensions.height || 52,
			})
		}

		for (const edge of edges) {
			dagreGraph.setEdge(edge.source, edge.target)
		}

		dagre.layout(dagreGraph)

		// set nodes with updated positions
		return nodes.map((node) => {
			const nodeWithPosition = dagreGraph.node(node.id)

			return {
				...node,
				targetPosition: isHorizontal ? Position.Left : Position.Top,
				sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
				position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
			}
		})
	}
}
