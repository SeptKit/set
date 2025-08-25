import type { DataflowType } from './connection'

export type DataObject = {
	id: string
	uuid: string
	name: string
	dataAttributes: DataAttribute[]
	lNodeId: string
}

export type DataObjectSpecification = {
	id: string
	name: string
	desc: string
	dataAttributeSpecifications: DataAttributeSpecification[]
	lNodeId: string
}

export type DataAttribute = {
	id: string
	uuid: string
	name: string
	dataObjectId: string
	fc: string
}

export type DataAttributeSpecification = {
	id: string
	name: string
	desc: string
	dataObjectSpecificationId: string
	subscriberLNode?: SubscriberLNode
}

export type SubscriberLNode = {
	id: string
	inputName: string
	service?: DataflowType
	pLN: string
}

export type LNode = {
	id: string
	uuid: string
	iedName: string
	lnType?: string
	prefix: string
	lnClass: string
	lnInst: string
	dataObjects: DataObject[]
	dataObjectSpecifications?: DataObjectSpecification[]
}

export function getLNodeLabel(lnode: LNode): string {
	return `${lnode.prefix} ${lnode.lnClass} ${lnode.lnInst}`
}
