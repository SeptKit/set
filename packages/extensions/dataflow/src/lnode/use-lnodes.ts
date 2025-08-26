import type {
	DataAttribute,
	DataAttributeSpecification,
	DataObject,
	DataObjectSpecification,
	LNode,
	SubscriberLNode,
} from '@/lnode/lnode'
import type { DatabaseRecord } from '@septkit/fileio'
import Dexie from 'dexie'
import { DataflowType } from './connection'
import { extractAttributeValue } from '../x/use-database'

export type LNodeSDK = ReturnType<typeof useLNodes>

export function useLNodes(db: Dexie) {
	return {
		findAllEnrichedFromDB,
		enrichWithDataObjects,
		enrichWithDataAttributes,
		enrichWithDataObjectSpecifications,
	}

	//Main function to get enriched LNodes from the database
	async function findAllEnrichedFromDB(): Promise<LNode[]> {
		const lnodes = await findAllNodesFromDB()
		if (!lnodes.length) return []

		const lnodesWithDOs = await enrichWithDataObjects(lnodes)
		const lnodesWithDAs = await enrichWithDataAttributes(lnodesWithDOs)
		const lnodesWithDOSs = await enrichWithDataObjectSpecifications(lnodesWithDAs)

		return lnodesWithDOSs
	}

	// Get the DataObjects for each LNode
	async function enrichWithDataObjects(lnodes: LNode[]): Promise<LNode[]> {
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
							uuid: extractAttributeValue(doRecord, 'uuid') ?? '',
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
	async function enrichWithDataAttributes(lnodes: LNode[]): Promise<LNode[]> {
		const allDOTypes = await db.table<DatabaseRecord>('DOType').toArray()
		const allDARecords = await db.table<DatabaseRecord>('DA').toArray()

		return Promise.all(
			lnodes.map(async (lnode) => {
				const dataObjectsArray = lnode.dataObjects
				if (!dataObjectsArray.length) return { ...lnode, dataObjects: [] }

				const enrichedDataObjects = await Promise.all(
					dataObjectsArray.map(async (dataObject) => {
						const doTypeId = dataObject
							? extractAttributeValue(
									await db.table<DatabaseRecord>('DO').get(dataObject.id)!,
									'type',
								)
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

							const daName = extractAttributeValue(daRecord, 'name') ?? daRecord.id
							const daFc = extractAttributeValue(daRecord, 'fc') ?? ''
							dataAttributes.push({
								id: daRecord.id,
								uuid: extractAttributeValue(daRecord, 'uuid') ?? '',
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

	async function enrichWithDataObjectSpecifications(lnodes: LNode[]): Promise<LNode[]> {
		const allPrivates = await db.table<DatabaseRecord>('Private').toArray()
		const allDOS = await db.table<DatabaseRecord>('DOS').toArray()
		const allDAS = await db.table<DatabaseRecord>('DAS').toArray()
		const allSubscriberLNodes = await db.table<DatabaseRecord>('SubscriberLNode').toArray()

		return Promise.all(
			lnodes.map(async (lnode) => {
				const privateRecord = allPrivates.find(
					(p) =>
						p.parent?.id === lnode.id &&
						p.parent?.tagName === 'LNode' &&
						extractAttributeValue(p, 'type') === 'eIEC61850-6-100',
				)
				if (!privateRecord || !privateRecord.children) {
					return { ...lnode, dataObjectSpecifications: [] }
				}

				//DOS
				const dosSpecs: DataObjectSpecification[] = []
				for (const childRef of privateRecord.children) {
					if (childRef.tagName !== 'DOS') continue

					const dosRecord = allDOS.find((d) => d.id === childRef.id)
					if (!dosRecord) continue

					// DAS
					const dasSpecs: DataAttributeSpecification[] = []
					if (dosRecord.children) {
						for (const dasRef of dosRecord.children) {
							if (dasRef.tagName !== 'DAS') continue

							const dasRecord = allDAS.find((d) => d.id === dasRef.id)
							if (!dasRecord) continue

							// Check for SubscriberLNode
							let subscriberLNode: SubscriberLNode | undefined = undefined
							if (dasRecord.children) {
								const subRef = dasRecord.children.find((c) => c.tagName === 'SubscriberLNode')

								if (subRef) {
									const subRec = allSubscriberLNodes.find((s) => s.id === subRef.id)

									if (subRec) {
										subscriberLNode = {
											id: subRec.id,
											inputName: extractAttributeValue(subRec, 'inputName') ?? '',
											service: extractDataflowTypeValue(subRec, 'service'),
											pLN: extractAttributeValue(subRec, 'pLN') ?? '',
										}
									}
								}
							}

							dasSpecs.push({
								id: dasRecord.id,
								name: extractAttributeValue(dasRecord, 'name') ?? '',
								desc: extractAttributeValue(dasRecord, 'desc') ?? '',
								dataObjectSpecificationId: dosRecord.id,
								subscriberLNode,
							})
						}
					}

					dosSpecs.push({
						id: dosRecord.id,
						name: extractAttributeValue(dosRecord, 'name') ?? '',
						desc: extractAttributeValue(dosRecord, 'desc') ?? '',
						dataAttributeSpecifications: dasSpecs,
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
			uuid: extractAttributeValue(record, 'uuid') ?? '',
			iedName: extractAttributeValue(record, 'iedName') ?? '',
			prefix: extractAttributeValue(record, 'prefix') ?? '',
			lnClass: extractAttributeValue(record, 'lnClass') ?? '',
			lnInst: extractAttributeValue(record, 'lnInst') ?? '',
			lnType: extractAttributeValue(record, 'lnType'),
			dataObjects: [],
		}))
	}
}

// Helper function to get DataflowType value from a record
export function extractDataflowTypeValue(
	record: DatabaseRecord | undefined,
	name: string,
): DataflowType | undefined {
	const str = record?.attributes?.find((a) => a.name === name)?.value
	if (!str) return undefined

	const upper = str.toUpperCase()
	switch (upper) {
		case 'GOOSE':
			return DataflowType.GOOSE
		case 'SMV':
			return DataflowType.SMV
		case 'REPORT':
			return DataflowType.REPORT
		case 'INTERNAL':
			return DataflowType.INTERNAL
		case 'WIRED':
			return DataflowType.WIRED
		case 'CONTROL':
			return DataflowType.CONTROL
		default:
			return undefined
	}
}
