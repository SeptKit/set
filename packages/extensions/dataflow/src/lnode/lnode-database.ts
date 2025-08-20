import type { DataAttribute, DataObject, DataObjectSpecification, LNode } from '@/lnode/lnode'
import type { DatabaseRecord } from '../../node_modules/@septkit/fileio/dist/common/common.types'
import Dexie from 'dexie'

export type LNodeSDK = ReturnType<typeof createLNodeSDK>

export function createLNodeSDK(db: Dexie) {
	return {
		findAllEnrichedLNodesFromDB,
		enrichLNodesWithDataObjects,
		enrichLNodesWithDataAttributes,
		enrichLNodesWithDataObjectSpecifications,
		close,
	}

	//Main function to get enriched LNodes from the database
	async function findAllEnrichedLNodesFromDB(): Promise<LNode[]> {
		const lnodes = await findAllNodesFromDB()
		if (!lnodes.length) return []

		const lnodesWithDOs = await enrichLNodesWithDataObjects(lnodes)
		const lnodesWithDAs = await enrichLNodesWithDataAttributes(lnodesWithDOs)
		const lnodesWithDOSs = await enrichLNodesWithDataObjectSpecifications(lnodesWithDAs)

		db.close()

		return lnodesWithDOSs
	}

	// Get the DataObjects for each LNode
	async function enrichLNodesWithDataObjects(lnodes: LNode[]): Promise<LNode[]> {
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
							uuid: findOneAttribute(doRecord, 'uuid') ?? '',
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
	async function enrichLNodesWithDataAttributes(lnodes: LNode[]): Promise<LNode[]> {
		const allDOTypes = await db.table<DatabaseRecord>('DOType').toArray()
		const allDARecords = await db.table<DatabaseRecord>('DA').toArray()

		return Promise.all(
			lnodes.map(async (lnode) => {
				const dataObjectsArray = lnode.dataObjects
				if (!dataObjectsArray.length) return { ...lnode, dataObjects: [] }

				const enrichedDataObjects = await Promise.all(
					dataObjectsArray.map(async (dataObject) => {
						const doTypeId = dataObject
							? findOneAttribute(await db.table<DatabaseRecord>('DO').get(dataObject.id)!, 'type')
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

							const daName = findOneAttribute(daRecord, 'name') ?? daRecord.id
							const daFc = findOneAttribute(daRecord, 'fc') ?? ''
							dataAttributes.push({
								id: daRecord.id,
								uuid: findOneAttribute(daRecord, 'uuid') ?? '',
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

	async function enrichLNodesWithDataObjectSpecifications(lnodes: LNode[]): Promise<LNode[]> {
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
						name: findOneAttribute(dosRecord, 'name') ?? '',
						desc: findOneAttribute(dosRecord, 'desc') ?? '',
						dataAttributeSpecification: [],
						lNodeId: lnode.id,
					})
				}
				return { ...lnode, dataObjectSpecifications: dosSpecs }
			}),
		)
	}

	// Find all LNode records from the database
	async function findAllNodesFromDB(): Promise<LNode[]> {
		const lnodeRecords = await db.table<DatabaseRecord>('LNode').toArray()
		return lnodeRecords.map((record) => ({
			id: record.id,
			uuid: findOneAttribute(record, 'uuid') ?? '',
			iedName: findOneAttribute(record, 'iedName') ?? '',
			prefix: findOneAttribute(record, 'prefix') ?? '',
			lnClass: findOneAttribute(record, 'lnClass') ?? '',
			lnInst: findOneAttribute(record, 'lnInst') ?? '',
			lnType: findOneAttribute(record, 'lnType'),
			dataObjects: [],
		}))
	}

	// Close the database connection
	function close() {
		db.close()
	}
}

// Helper function to get an attribute value from a record
function findOneAttribute(record: DatabaseRecord | undefined, name: string): string | undefined {
	return record?.attributes?.find((a) => a.name === name)?.value
}
