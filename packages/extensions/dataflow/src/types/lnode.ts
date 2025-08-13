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
	name: string
	lnType?: string
	dataObjects: DataObject[]
}
