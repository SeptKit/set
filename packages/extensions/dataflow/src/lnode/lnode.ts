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
	dataAttributeSpecification: DataAttributeSpecification[]
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
	dataObjectSpecificationId: string
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

export type Connection = {
	id: string
	sourceLNodeId: string
	sourceAttributeId: string
	destinationLNodeId: string
	dataflowType: 'goose' | 'smv' | 'reporting' | 'internal' | 'wired' | 'control'
	inputInstance: string
	inputName: string
}

export function getLNodeLabel(lnode: LNode): string {
	return `${lnode.prefix} ${lnode.lnClass} ${lnode.lnInst}`
}
