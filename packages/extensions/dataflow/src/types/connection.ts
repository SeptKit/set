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

export const DataflowTypeToFCMap: Record<DataflowType, string[]> = {
	[DataflowType.GOOSE]: ['ST', 'MX', 'SP', 'OR'],
	[DataflowType.SMV]: ['ST', 'MX'],
	[DataflowType.REPORTING]: [
		'ST',
		'MX',
		'SP',
		'SV',
		'CF',
		'DC',
		'SG',
		'SE',
		'SR',
		'OR',
		'BL',
		'EX',
	],
	[DataflowType.INTERNAL]: ['ST', 'MX', 'SP', 'SV', 'CF', 'DC', 'SG', 'SE', 'SR', 'OR', 'BL', 'EX'],
	[DataflowType.WIRED]: ['ST', 'MX', 'SP', 'SV', 'CF', 'DC', 'SG', 'SE', 'SR', 'OR', 'BL', 'EX'],
	[DataflowType.CONTROL]: [], // TODO
}
