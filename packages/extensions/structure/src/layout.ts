import Elk, { type ElkExtendedEdge, type ElkNode } from 'elkjs/lib/elk.bundled.js'
import type { Node as FlowNode } from '@vue-flow/core'
import type { DatabaseRecord } from '@septkit/fileio'
import { extractAttr } from './sdk'
import { ref } from 'vue'

// Note: this is a useful function to print out
// all the possible configuration of elk into the console
// @ts-expect-error
window.provideElkOptionstoWindow = provideElkOptionstoWindow

const NODE_WIDTH = 140
const NODE_HEIGHT = 50

type ElkNodeWithRecord = ElkNode & {
	record: DatabaseRecord
	childrenCache: ElkNodeWithRecord[]
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
			'elk.algorithm': 'box',
			'elk.direction': 'RIGHT',
			'elk.padding': '[top=50,right=10,bottom=10,left=10]',
			'elk.spacing.nodeNode': '30',
			'elk.interactive': 'true',
			interactiveLayout: 'true',
		},
	})

	return {
		calcLayout,
		reCalcLayout,
		flowNodes: _flowNodes,
		setRecords,
		setConnections,
		toggleNode,
		hasNodeLoadedChildren,
		addChildren,
		borrowRecordById,
		expandNode,
		collapseNode,
	}

	async function calcLayout(): Promise<void> {
		const elkNodesFlat = _records.map(recordToElkNode)
		const elkNodes = setupRelationships(elkNodesFlat)
		const elkEdges = _connections.map(connectionToEdge)

		const graph: ElkNode = {
			id: 'root',
			children: elkNodes,
			edges: elkEdges,
			layoutOptions: {
				'layering.layerChoiceConstraint': '0',
			},
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

	async function expandNode(nodeId: string) {
		const node = getNodeById(nodeId)

		node.children = [...node.childrenCache]
		await reCalcLayout()
	}

	async function collapseNode(nodeId: string) {
		const node = getNodeById(nodeId)
		node.children = []
		node.width = NODE_WIDTH
		node.height = NODE_HEIGHT
		await reCalcLayout()
	}

	async function toggleNode(nodeId: string) {
		const node = getNodeById(nodeId)

		const isExpanded = Boolean(node.children && node.children.length > 0)

		if (isExpanded) {
			collapseNode(nodeId)
		} else {
			expandNode(nodeId)
		}
	}

	function hasNodeLoadedChildren(nodeId: string): Boolean {
		const node = getNodeById(nodeId)

		const hasChildren = Boolean(node.childrenCache && node.childrenCache.length > 0)

		return hasChildren
	}

	function addChildren(nodeId: string, children: DatabaseRecord[]) {
		const node = getNodeById(nodeId)

		_records.push(...children)
		const elkNodes = children.map(recordToElkNode)

		node.children = elkNodes
		node.childrenCache = elkNodes
	}

	function updateFlowNodes(rootElkNode: RootElkNode) {
		const newElkNodesFlat = flattenElkNodes(rootElkNode.children)
		_elkNodeMapById = newElkNodesFlat.reduce((mapById, node) => {
			mapById[node.id] = node
			return mapById
		}, {} as ElkNodeMapById)

		_flowNodes.value = newElkNodesFlat.map(elkNodeToFlowNode)
	}

	function getNodeById(nodeId: string): ElkNodeWithRecord {
		const node = _elkNodeMapById[nodeId]
		if (!node) {
			throw Error(`not not found, id: ${nodeId}`)
		}
		return node
	}

	function borrowRecordById(recordId: string): DatabaseRecord | undefined {
		const record = _records.find((r) => r.id === recordId)
		return record
	}
}

function recordToElkNode(record: DatabaseRecord): ElkNodeWithRecord {
	return {
		id: record.id,
		width: NODE_WIDTH,
		height: NODE_HEIGHT,
		record,
		childrenCache: [],
		layoutOptions: {
			'layering.layerChoiceConstraint': '0',
		},
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
		parentNode.childrenCache.push(node)
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
	const isExpanded = Boolean(elkNode.children && elkNode.children.length > 0)

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
			isExpanded,
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
	const defaultLabelExtractor = extractNameAttributeValue
	const extractor = labelExtractors[tagName]
	if (!extractor) {
		console.warn({ msg: 'no label extractor found, using default', tagName })
		return defaultLabelExtractor
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
	AllocationRole: extractNameAttributeValue,
	ConductingEquipment: extractNameAttributeValue,
	SubEquipment: extractNameAttributeValue,
	BehaviorDescription: extractNameAttributeValue,
	InputVar: inputVarLabelExtractor,
	FunctionCategory: extractNameAttributeValue,
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
// varName
function inputVarLabelExtractor(record: DatabaseRecord): string {
	const defaultLabel = `<${record.tagName} without varName>`
	const varNameAttr = extractAttr(record, 'varName')
	if (!varNameAttr) {
		return defaultLabel
	}
	return varNameAttr.value
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

async function provideElkOptionstoWindow() {
	const elk = new Elk()

	// @ts-expect-error
	window.elkAlgos = await elk.knownLayoutAlgorithms()
	// @ts-expect-error
	window.elkoptions = await elk.knownLayoutOptions()
	// @ts-expect-error
	window.elkCats = await elk.knownLayoutCategories()

	console.debug('options has been set on the window object', {
		// @ts-expect-error
		elkAlgos: window.elkAlgos,
		// @ts-expect-error
		elkoptions: window.elkoptions,
		// @ts-expect-error
		elkCats: window.elkCats,
	})
}
