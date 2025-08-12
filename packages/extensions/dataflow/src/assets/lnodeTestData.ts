import type { LNodeObject, DataflowType } from './lnode.types'

/**
 * Notes:
 * - The data is structured so that connections with `connected: true` and matching `dataflowType`
 *   are possible between nodes (e.g., `TestLNode1` and `TestLNode3` both have Goose).
 *
 * - The string fields (`do`, `da`, `destinationInputName`) contain human-readable sample test names.
 *
 * - Each node has multiple `sourcePorts` and `destinationPorts`; at least one port in every node is always `connected: true`.
 */

const testLNodeArray: LNodeObject[] = [
	{
		name: 'TestLNode1',
		sourcePorts: [
			{
				dataflowType: 'goose',
				do: 'TripSignal',
				da: 'Operate',
				connected: true,
			},
			{
				dataflowType: 'smv',
				do: 'VoltageSample',
				da: 'Instant',
				connected: false,
			},
		],
		destinationPorts: [
			{
				dataflowType: 'goose',
				destinationInputName: 'ProtectionAction',
				inputInstance: 1,
				connected: true,
			},
			{
				dataflowType: 'reporting',
				destinationInputName: 'EventLogger',
				inputInstance: 1,
				connected: false,
			},
		],
	},
	{
		name: 'TestLNode2',
		sourcePorts: [
			{
				dataflowType: 'reporting',
				do: 'DisturbanceReport',
				da: 'Start',
				connected: true,
			},
			{
				dataflowType: 'wired',
				do: 'AnalogInput',
				da: 'Value',
				connected: false,
			},
		],
		destinationPorts: [
			{
				dataflowType: 'reporting',
				destinationInputName: 'ReportReceiver',
				inputInstance: 2,
				connected: true,
			},
			{
				dataflowType: 'wired',
				destinationInputName: 'PhysicalRelay',
				inputInstance: 1,
				connected: false,
			},
		],
	},
	{
		name: 'TestLNode3',
		sourcePorts: [
			{
				dataflowType: 'internal',
				do: 'SelfTest',
				da: 'Result',
				connected: false,
			},
			{
				dataflowType: 'goose',
				do: 'AlarmSignal',
				da: 'Actuate',
				connected: true,
			},
			{
				dataflowType: 'reporting',
				do: 'StatusReport',
				da: 'Update',
				connected: true,
			},
		],
		destinationPorts: [
			{
				dataflowType: 'internal',
				destinationInputName: 'DiagnosticModule',
				inputInstance: 1,
				connected: false,
			},
			{
				dataflowType: 'goose',
				destinationInputName: 'AlarmHandler',
				inputInstance: 2,
				connected: true,
			},
			{
				dataflowType: 'reporting',
				destinationInputName: 'MonitorSystem',
				inputInstance: 3,
				connected: true,
			},
		],
	},
]

export default testLNodeArray
