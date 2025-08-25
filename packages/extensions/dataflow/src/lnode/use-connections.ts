import Dexie from 'dexie'
import { type Connection } from './connection'
import type { DatabaseRecord } from '@septkit/fileio'
import { extractAttributeValue, useDatabase } from '@/x/use-database'
import { extractDataflowTypeValue } from './use-lnodes'

export type ConnectionSDK = ReturnType<typeof useConnections>

export function useConnections(db: Dexie) {
	const databaseSdk = useDatabase(db)

	return {
		findAllExistingFromDB,
	}

	// Get all existing connections from the database via SourceRef elements
	async function findAllExistingFromDB(): Promise<Connection[]> {
		const sourceRefRecords = await db.table<DatabaseRecord>('SourceRef').toArray()
		if (!sourceRefRecords.length) return []

		const connections: Connection[] = []
		for (const sourceRef of sourceRefRecords) {
			if (!sourceRef.attributes) continue

			const sourceLNodeUuid = extractAttributeValue(sourceRef, 'sourceLNodeUuid')
			const sourceDoName = extractAttributeValue(sourceRef, 'sourceDoName')
			const sourceDaName = extractAttributeValue(sourceRef, 'sourceDaName')
			const source = extractAttributeValue(sourceRef, 'source')

			const sourceLNodeId =
				(await db
					.table<DatabaseRecord>('LNode')
					.toArray()
					.then(
						(lnodes) =>
							lnodes.find((lnode) =>
								lnode.attributes?.some(
									(attr) => attr.name === 'uuid' && attr.value === sourceLNodeUuid,
								),
							)?.id,
					)) || null

			const sourceAttributes = [sourceLNodeUuid, sourceDoName, sourceDaName, source, sourceLNodeId]

			// TODO: later create Connection object with missing source as placeholder destination LNode
			if (sourceAttributes.some((attr) => !attr)) {
				console.log(`source attribute from SourceRef missing: ${sourceAttributes.join(', ')}`)
				continue
			}

			const destinationLNodeRecords = await databaseSdk.findParentRecordsWithinDepthAndGivenTagName(
				sourceRef,
				3,
				['LNode'],
			)

			if (destinationLNodeRecords.length != 1) {
				const errMsg = {
					msg: 'LNode record not found for SourceRef id',
					id: sourceRef.id,
				}
				console.error(errMsg)
				throw new Error(JSON.stringify(errMsg))
			}

			const connection: Connection = {
				sourceLNodeId: sourceLNodeId,
				destinationLNodeId: destinationLNodeRecords[0].id,
				sourceDataObject: sourceDoName!,
				sourceDataAttribute: sourceDaName!,
				dataflowType: extractDataflowTypeValue(sourceRef, 'service'),
				inputInstance: extractAttributeValue(sourceRef, 'inputInst') || '',
				input: extractAttributeValue(sourceRef, 'input') || '',
			}

			connections.push(connection)
		}

		return connections
	}
}
