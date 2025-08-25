export enum DataflowType {
	GOOSE = 'GOOSE',
	SMV = 'SMV',
	REPORT = 'Report',
	INTERNAL = 'Internal',
	WIRED = 'Wired',
	CONTROL = 'Control',
}

export type Connection = {
	sourceLNodeId: string | null
	destinationLNodeId: string | null
	sourceDataObject: string
	sourceDataAttribute: string
	dataflowType?: DataflowType
	inputInstance: string
	input: string
}

export const DataflowTypeToFCMap: Record<DataflowType, string[]> = {
	[DataflowType.GOOSE]: ['ST', 'MX', 'SP', 'OR'],
	[DataflowType.SMV]: ['ST', 'MX'],
	[DataflowType.REPORT]: ['ST', 'MX', 'SP', 'SV', 'CF', 'DC', 'SG', 'SE', 'SR', 'OR', 'BL', 'EX'],
	[DataflowType.INTERNAL]: ['ST', 'MX', 'SP', 'SV', 'CF', 'DC', 'SG', 'SE', 'SR', 'OR', 'BL', 'EX'],
	[DataflowType.WIRED]: ['ST', 'MX', 'SP', 'SV', 'CF', 'DC', 'SG', 'SE', 'SR', 'OR', 'BL', 'EX'],
	[DataflowType.CONTROL]: [], // TODO
}
