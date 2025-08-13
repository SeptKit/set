export enum DataflowType {
	GOOSE = 'goose',
	SMV = 'smv',
	REPORTING = 'reporting',
	INTERNAL = 'internal',
	WIRED = 'wired',
	CONTROL = 'control',
}

export type Connection = {
	id: string
	sourceLNodeId: string
	sourceAttributeId: string
	destinationLNodeId: string
	dataflowType: DataflowType
	inputInstance: string
	inputName: string
}
