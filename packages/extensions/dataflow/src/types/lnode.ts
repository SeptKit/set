export type DataObject = {
	id: string
	uuid: string
	name: string
	dataAttributes: DataAttribute[]
	lNodeId: string
}

export type DataAttribute = {
	id: string
	uuid: string
	name: string
	dataObjectId: string
	fc: string
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
}

export function getLNodeLabel(lnode: LNode): string {
	return `${lnode.prefix} ${lnode.lnClass} ${lnode.lnInst}`
}
