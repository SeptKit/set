export interface LNodeObject {
	name: string
	sourcePorts: SourcePort[]
	destinationPorts: DestinationPort[]
}

export type DataflowType = 'goose' | 'smv' | 'reporting' | 'internal' | 'wired' | 'control'

interface SourcePort {
	dataflowType?: DataflowType
	do?: string
	da?: string
	connected: boolean
}

interface DestinationPort {
	dataflowType?: DataflowType
	destinationInputName?: string
	inputInstance?: number
	connected: boolean
}
