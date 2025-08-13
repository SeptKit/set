export type DataObject = {
	id: string
	name: string
	dataAttributes: DataAttribute[]
	lNodeId: string
}

export type DataAttribute = {
	id: string
	name: string
	dataObjectId: string
	fc: string
}

export type LNode = {
	id: string
	name: string
	dataObjects: DataObject[]
}
