import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode } from '@vue-flow/core'
import type { DatabaseRecord } from '@septkit/fileio'
import { extractAttr } from './sdk'

// Note: this is a useful function to print out
// all the possible configuration of elk into the console
// @ts-expect-error
window.printElkInfo = printElkInfo

const NODE_WIDTH = 140
const NODE_HEIGHT = 50

export type CombinedNode = ElkNode & { flowNode: FlowNode }
export type Connection = {
	id: string
	source: string
	target: string
}

export function useLayout() {
	return {
		calcLayout,
	}

	async function calcLayout(
		records: DatabaseRecord[],
		conections: Connection[],
	): Promise<FlowNode[]> {
		const elk = new Elk({
			defaultLayoutOptions: {
				'elk.algorithm': 'layered',
				'elk.padding': '[top=35,right=10,bottom=10,left=10]',
				'elk.spacing.nodeNode': '100',
			},
		})

		const elkNodesFlat = records.map(recordToElkNode)
		const elkNodes = setupRelationships(elkNodesFlat)
		const elkEdges = conections.map(connectionToEdge)

		const graph: ElkNode = {
			id: 'root',
			children: elkNodes,
			edges: elkEdges,
		}

		const rootNode = (await elk.layout(graph)) as ElkNode & {
			children: ElkNodeWithRecord[]
		}
		const newElkNodesFlat = flattenElkNodes(rootNode.children)
		const newFlowNodes = newElkNodesFlat.map(elkNodeToFlowNode)

		return newFlowNodes ?? []
	}
}

function recordToElkNode(record: DatabaseRecord): ElkNodeWithRecord {
	return {
		id: record.id,
		width: NODE_WIDTH,
		height: NODE_HEIGHT,
		record,
	}
}

function connectionToEdge(connection: Connection): ElkExtendedEdge {
	return {
		id: connection.id,
		sources: [connection.source],
		targets: [connection.target],
	}
}

function setupRelationships(nodes: ElkNodeWithRecord[]) {
	const nodeMapById = nodes.reduce((nodeMap: { [nodeId: string]: ElkNodeWithRecord }, node) => {
		nodeMap[node.id] = node
		return nodeMap
	}, {})

	const nodesWithChildren: ElkNodeWithRecord[] = []
	for (const nodeId of Object.keys(nodeMapById)) {
		const node = nodeMapById[nodeId]
		const parentId = node.record.parent?.id
		const isSCLChildNode = node.record.parent?.tagName === 'SCL'

		// We put the parentless and SCL child nodes into the array because
		// they are our entrypoint for later
		if (!parentId || isSCLChildNode) {
			nodesWithChildren.push(node)
			continue
		}

		const parentNode = nodeMapById[parentId]
		if (!parentNode) {
			const msg = {
				msg: 'there was a parent id but could not find the parent node, moving on',
				parentId,
				parentTagName: node.record.parent?.tagName,
			}
			console.warn(msg)
			continue
		}

		if (!parentNode.children) {
			parentNode.children = []
		}

		parentNode.children.push(node)
	}

	return nodesWithChildren
}

function flattenElkNodes(elkNodes: ElkNodeWithRecord[]): ElkNodeWithRecord[] {
	const flattenedNodes: ElkNodeWithRecord[] = []

	for (const node of elkNodes) {
		flattenedNodes.push(node)
		if (node.children) {
			const flattenedChildren = flattenElkNodes(node.children as ElkNodeWithRecord[])
			flattenedNodes.push(...flattenedChildren)
		}
	}

	return flattenedNodes
}

function elkNodeToFlowNode(elkNode: ElkNodeWithRecord): FlowNode {
	const extractLabel = getLabelExtractor(elkNode.record.tagName)

	return {
		id: elkNode.id,
		// TODO: temporary, this should depent on the records tagname
		type: 'bay',
		data: {
			label: extractLabel(elkNode.record),
			tagName: elkNode.record.tagName,
			width: elkNode.width,
			height: elkNode.height,
		},
		parentNode: elkNode.record.parent?.id,
		position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
		width: NODE_WIDTH,
		height: NODE_HEIGHT,
		// TODO: users can only move elements within their parent
		// We can allow moving outside when we implement the feature
		extent: 'parent',
		// TODO: should be configurable but for now we don't want to move elements around
		draggable: false,
		selectable: false,
		connectable: false,
		focusable: false,
		deletable: false,
	}
}

type ElkNodeWithRecord = ElkNode & { record: DatabaseRecord }

function getLabelExtractor(tagName: string): LabelExtractor {
	const extractor = labelExtractors[tagName]
	if (!extractor) {
		throw new Error(`not label extractor for tagName: ${tagName}`)
	}
	return extractor
}
const labelExtractors: { [tagName: string]: LabelExtractor } = {
	Substation: extractNameAttributeValue,
	VoltageLevel: extractNameAttributeValue,
	Bay: extractNameAttributeValue,
	Function: extractNameAttributeValue,
	LNode: lnodeLabelExtractor,
	SubFunction: extractNameAttributeValue,
	Private: extractTypeAttributeValue,
	Application: extractNameAttributeValue,
}
type LabelExtractor = (r: DatabaseRecord) => string

function extractNameAttributeValue(record: DatabaseRecord): string {
	const defaultLabel = `<${record.tagName} without name>`
	const nameAttr = extractAttr(record, 'name')
	if (!nameAttr) {
		console.error('record does not have a name attribute, returning default label', record)
		return defaultLabel
	}

	return nameAttr.value
}

function extractTypeAttributeValue(record: DatabaseRecord): string {
	const defaultLabel = `<${record.tagName} without type>`
	const typeAttr = extractAttr(record, 'type')
	if (!typeAttr) {
		console.error('record does not have a type attribute, returning default label', record)
		return defaultLabel
	}

	return typeAttr.value
}

function lnodeLabelExtractor(record: DatabaseRecord) {
	if (record.tagName !== 'LNode') {
		console.warn('not an LNode;', record)
	}

	const lnTypeAttr = extractAttr(record, 'lnType')
	if (!lnTypeAttr) {
		const err = { msg: 'could not extract lnType', record }
		console.error(err)
		throw new Error(JSON.stringify(err))
	}
	const lnInstAttr = extractAttr(record, 'lnInst')
	if (!lnInstAttr) {
		const err = { msg: 'could not extract lnInst', record }
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	return `${lnTypeAttr.value}-${lnInstAttr.value}`
}

async function printElkInfo() {
	const elk = new Elk()

	const algos = await elk.knownLayoutAlgorithms()
	const options = await elk.knownLayoutOptions()
	const cats = await elk.knownLayoutCategories()

	console.info(
		'elk algos:',
		algos.map((a) => a.id),
	)

	console.info(
		'elk options',
		options.map((o) => o.id),
	)

	console.info(
		'elk cats',
		cats.map((c) => c.id),
	)
}
