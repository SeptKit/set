import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode } from '@vue-flow/core'
import type { DatabaseRecord } from '@septkit/fileio'
import { extractAttr } from './sdk'
import { ref } from 'vue'

// Note: this is a useful function to print out
// all the possible configuration of elk into the console
// @ts-expect-error
window.printElkInfo = printElkInfo

const NODE_WIDTH = 140
const NODE_HEIGHT = 50

type ElkNodeWithRecord = ElkNode & {
	record: DatabaseRecord
	isOpen: boolean
	permanentChildren: ElkNodeWithRecord[]
}
export type RootElkNode = ElkNode & {
	children: ElkNodeWithRecord[]
}
type ElkNodeMapById = { [id: string]: ElkNodeWithRecord }
export type CombinedNode = ElkNode & { flowNode: FlowNode }
export type Connection = {
	id: string
	source: string
	target: string
}

export type Layout = ReturnType<typeof useLayout>

export function useLayout() {
	let _rootElkNode: RootElkNode | undefined = undefined
	let _elkNodeMapById: ElkNodeMapById = {}
	const _flowNodes = ref<FlowNode[]>([])
	let _records: DatabaseRecord[] = []
	let _connections: Connection[] = []
	const elk = new Elk({
		defaultLayoutOptions: {
			'elk.algorithm': 'layered',
			'elk.padding': '[top=50,right=10,bottom=10,left=10]',
			'elk.spacing.nodeNode': '100',
		},
	})

	return {
		calcLayout,
		reCalcLayout,
		flowNodes: _flowNodes,
		setRecords,
		setConnections,
		toggleNode,
	}

	async function calcLayout(): Promise<void> {
		const elkNodesFlat = _records.map(recordToElkNode)
		const elkNodes = setupRelationships(elkNodesFlat)
		const elkEdges = _connections.map(connectionToEdge)

		const graph: ElkNode = {
			id: 'root',
			children: elkNodes,
			edges: elkEdges,
		}

		_rootElkNode = (await elk.layout(graph)) as RootElkNode
		updateFlowNodes(_rootElkNode)
	}

	async function reCalcLayout() {
		if (!_rootElkNode) {
			return
		}
		_rootElkNode = (await elk.layout(_rootElkNode)) as RootElkNode
		updateFlowNodes(_rootElkNode)
	}

	function setRecords(newRecords: DatabaseRecord[]) {
		_records = newRecords
	}

	function setConnections(newConnection: Connection[]) {
		_connections = newConnection
	}

	async function toggleNode(id: string) {
		const node = _elkNodeMapById[id]
		if (!node) {
			throw Error(`could not toggle node state, id: ${id}`)
		}

		if (node.isOpen) {
			node.children = []
			node.width = NODE_WIDTH
			node.height = NODE_HEIGHT
			node.isOpen = false
		} else {
			node.children = [...node.permanentChildren]
			node.isOpen = true
		}

		await reCalcLayout()
	}

	function updateFlowNodes(rootElkNode: RootElkNode) {
		const newElkNodesFlat = flattenElkNodes(rootElkNode.children)
		_elkNodeMapById = newElkNodesFlat.reduce((mapById, node) => {
			mapById[node.id] = node
			return mapById
		}, {} as ElkNodeMapById)

		_flowNodes.value = newElkNodesFlat.map(elkNodeToFlowNode)
	}
}

function recordToElkNode(record: DatabaseRecord): ElkNodeWithRecord {
	const isOpen = Boolean(record.children && record.children.length > 0)

	return {
		id: record.id,
		width: NODE_WIDTH,
		height: NODE_HEIGHT,
		record,
		isOpen,
		permanentChildren: [],
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
		parentNode.permanentChildren.push(node)
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
	const hasChildren = elkNode.record.children && elkNode.record.children.length > 0

	return {
		id: elkNode.id,
		// TODO: temporary, this should depent on the records tagname
		type: 'expandable',
		data: {
			label: extractLabel(elkNode.record),
			tagName: elkNode.record.tagName,
			width: elkNode.width,
			height: elkNode.height,
			hasChildren,
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
