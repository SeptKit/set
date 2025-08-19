import type { DataAttribute, DataObject, DataObjectSpecification, LNode } from '@/types/lnode'
import type { DatabaseRecord } from '../../node_modules/@septkit/fileio/dist/common/common.types'
import Dexie from 'dexie'
import { useStorage } from '@vueuse/core'
import { openDatabase } from './open-db'

//Main function to get enriched LNodes from the database
export async function getEnrichedLNodesFromDB(): Promise<LNode[]> {
	const currentActiveFileDatabaseName = useStorage<string>(
		'currentActiveFileDatabaseName',
		'',
		localStorage,
	)
	if (!currentActiveFileDatabaseName.value) throw new Error('No active file database name set.')
	const db = await openDatabase(currentActiveFileDatabaseName.value)
	if (!db) throw new Error('database is not initialized.')
	const lnodes = await getAllLNodes(db)
	if (!lnodes.length) return []
	const lnodesWithDOs = await enrichLNodesWithDataObjects(db, lnodes)
	const lnodesWithDAs = await enrichLNodesWithDataAttributes(db, lnodesWithDOs)
	const lnodesWithDOSs = await enrichLNodesWithDataObjectSpecifications(db, lnodesWithDAs)

	db.close()

	return lnodesWithDOSs
}

// Get all LNode records from the database
export async function getAllLNodes(db: Dexie): Promise<LNode[]> {
	const lnodeRecords = await db.table<DatabaseRecord>('LNode').toArray()
	return lnodeRecords.map((record) => ({
		id: record.id,
		uuid: getAttribute(record, 'uuid') ?? '',
		iedName: getAttribute(record, 'iedName') ?? '',
		prefix: getAttribute(record, 'prefix') ?? '',
		lnClass: getAttribute(record, 'lnClass') ?? '',
		lnInst: getAttribute(record, 'lnInst') ?? '',
		lnType: getAttribute(record, 'lnType'),
		dataObjects: [],
	}))
}

// Get the DataObjects for each LNode
export async function enrichLNodesWithDataObjects(db: Dexie, lnodes: LNode[]): Promise<LNode[]> {
	const allLNodeTypes = await db.table<DatabaseRecord>('LNodeType').toArray()
	return Promise.all(
		lnodes.map(async (lnode) => {
			if (!lnode.lnType) return { ...lnode, dataObjects: [] }

			const lnodeType = allLNodeTypes.find((rec) =>
				rec.attributes?.find((attr) => attr.name === 'id' && attr.value === lnode.lnType),
			)
			const dataObjects: DataObject[] = []
			if (lnodeType?.children) {
				for (const childRef of lnodeType.children) {
					if (childRef.tagName !== 'DO') continue
					const doRecord = await db.table<DatabaseRecord>('DO').get(childRef.id)
					if (!doRecord) continue
					dataObjects.push({
						id: doRecord.id,
						uuid: getAttribute(doRecord, 'uuid') ?? '',
						name: doRecord.attributes?.find((a) => a.name === 'name')?.value ?? doRecord.id,
						lNodeId: lnode.id,
						dataAttributes: [],
					})
				}
			}
			return { ...lnode, dataObjects }
		}),
	)
}

//Get the DataAttributes for each DataObject in each LNode
export async function enrichLNodesWithDataAttributes(db: Dexie, lnodes: LNode[]): Promise<LNode[]> {
	const allDOTypes = await db.table<DatabaseRecord>('DOType').toArray()
	const allDARecords = await db.table<DatabaseRecord>('DA').toArray()

	return Promise.all(
		lnodes.map(async (lnode) => {
			const enrichedDataObjects = await Promise.all(
				(lnode.dataObjects ?? []).map(async (dataObject) => {
					const doTypeId = dataObject
						? getAttribute(await db.table<DatabaseRecord>('DO').get(dataObject.id)!, 'type')
						: undefined
					if (!doTypeId) return { ...dataObject, dataAttributes: [] }

					const doType = allDOTypes.find((rec) =>
						rec.attributes?.find((a) => a.name === 'id' && a.value === doTypeId),
					)
					if (!doType || !doType.children) return { ...dataObject, dataAttributes: [] }

					const dataAttributes: DataAttribute[] = []
					for (const childRef of doType.children) {
						if (childRef.tagName !== 'DA') continue
						const daRecord = allDARecords.find((d) => d.id === childRef.id)
						if (!daRecord) continue
						const daName = getAttribute(daRecord, 'name') ?? daRecord.id
						const daFc = getAttribute(daRecord, 'fc') ?? ''
						dataAttributes.push({
							id: daRecord.id,
							uuid: getAttribute(daRecord, 'uuid') ?? '',
							name: daName,
							dataObjectId: dataObject.id,
							fc: daFc,
						})
					}
					return { ...dataObject, dataAttributes }
				}),
			)
			return { ...lnode, dataObjects: enrichedDataObjects }
		}),
	)
}

export async function enrichLNodesWithDataObjectSpecifications(
	db: Dexie,
	lnodes: LNode[],
): Promise<LNode[]> {
	const allPrivates = await db.table<DatabaseRecord>('Private').toArray()
	const allDOS = await db.table<DatabaseRecord>('DOS').toArray()

	return Promise.all(
		lnodes.map(async (lnode) => {
			// 1) find Private element
			const privateRecord = allPrivates.find(
				(p) => p.parent?.id === lnode.id && p.parent?.tagName === 'LNode',
			)
			if (!privateRecord || !privateRecord.children) {
				return { ...lnode, dataObjectSpecifications: [] }
			}

			// 2) get DOS-Children of the Private element
			const dosSpecs: DataObjectSpecification[] = []
			for (const childRef of privateRecord.children) {
				if (childRef.tagName !== 'DOS') continue
				const dosRecord = allDOS.find((d) => d.id === childRef.id)
				if (!dosRecord) continue

				dosSpecs.push({
					id: dosRecord.id,
					name: getAttribute(dosRecord, 'name') ?? '',
					desc: getAttribute(dosRecord, 'desc') ?? '',
					dataAttributeSpecification: [],
					lNodeId: lnode.id,
				})
			}
			return { ...lnode, dataObjectSpecifications: dosSpecs }
		}),
	)
}

// Helper function to get an attribute value from a record
function getAttribute(record: DatabaseRecord | undefined, name: string): string | undefined {
	return record?.attributes?.find((a) => a.name === name)?.value
}
