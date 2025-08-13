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

export type Connection = {
	id: string
	sourceLNodeId: string
	sourceAttributeId: string
	destinationLNodeId: string
	dataflowType: 'goose' | 'smv' | 'reporting' | 'internal' | 'wired' | 'control'
	inputInstance: string
	inputName: string
}
