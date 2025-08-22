import type Dexie from 'dexie'
import type { PartialBy } from './x/types/types'
import type { Relationship, Attribute, DatabaseRecord, QualifiedAttribute } from '@septkit/fileio'

export type SDK = ReturnType<typeof useSDK>

export function useSDK(db: Dexie) {
	return {
		addRecord,
		updateRecord,
		findRecordsByTagName,
		findChildRecords,
		findChildRecordsByTagName,
		findChildRecordsWithinDepthAndGivenTagName,
		instantiate,
		ensureRelationship,
		findRootSCL,
		recordExists,
		findOneRecordByAttribute,
		close,
		db,
	}

	/**
	 *
	 * @param record the added record
	 */
	async function addRecord(
		originalRecord: PartialBy<DatabaseRecord, 'id'>,
	): Promise<DatabaseRecord> {
		const recordToAdd: DatabaseRecord = {
			...originalRecord,
			id: crypto.randomUUID(),
		}
		try {
			const addedId = await db.table<DatabaseRecord>(recordToAdd.tagName).add(recordToAdd)
			const addedRecord = await db.table<DatabaseRecord>(recordToAdd.tagName).get(addedId)
			if (!addedRecord) {
				const errMsg = { msg: 'could not find added record', table: recordToAdd.tagName, addedId }
				console.error(errMsg)
				throw new Error(JSON.stringify(errMsg))
			}

			return addedRecord
		} catch (err) {
			const errMsg = {
				msg: 'could not add record',
				db: db.name,
				table: recordToAdd.tagName,
				recordToAdd,
				err,
			}
			console.error(errMsg)
			throw new Error(JSON.stringify(errMsg))
		}
	}

	async function updateRecord(record: DatabaseRecord): Promise<void> {
		try {
			const nrOfUpdatedRecords = await db
				.table<DatabaseRecord>(record.tagName)
				.update(record.id, record)
			if (nrOfUpdatedRecords < 1) {
				const err = { msg: 'nothing has been updated', record }
				console.error(err)
				throw new Error(JSON.stringify(err))
			}
		} catch (err) {
			console.error(err)
		}
	}

	async function recordExists(record: DatabaseRecord): Promise<boolean> {
		const nrOfRecordsWithId = await db
			.table<DatabaseRecord>(record.tagName)
			.where({ id: record.id })
			.count()
		const exists = nrOfRecordsWithId > 0

		return exists
	}

	async function ensureRelationship(parent: DatabaseRecord, child: DatabaseRecord) {
		const parentHasChild = parent.children?.some(
			(c) => c.id === child.id && c.tagName === child.tagName,
		)
		const childHasParent =
			child.parent?.id === parent.id && child.parent?.tagName === parent.tagName

		if (!parentHasChild) {
			if (!parent.children) {
				parent.children = []
			}
			parent.children.push({
				id: child.id,
				tagName: child.tagName,
			})
			await db.table(parent.tagName).update(parent.id, parent)
		}

		if (!childHasParent) {
			child.parent = {
				id: parent.id,
				tagName: parent.tagName,
			}
			await db.table(child.tagName).update(child.id, child)
		}
	}

	async function findRootSCL(): Promise<DatabaseRecord> {
		const nrOfSCLs = await db.table<DatabaseRecord>('SCL').count()
		if (nrOfSCLs === 0) throw new Error('tfindRootSCLhere is no SCL element')
		if (nrOfSCLs > 1) throw new Error('there are multiple SCL elements; there can be only one')

		const sclElement = await db.table<DatabaseRecord>('SCL').orderBy('id').first()
		if (!sclElement) throw new Error('no root scl found')

		const firstSCL = sclElement

		return firstSCL
	}

	async function findRecordsByTagName(tagName: string): Promise<DatabaseRecord[]> {
		const records = await db.table<DatabaseRecord>(tagName).toArray()
		return records
	}

	// TODO: fsdReference with file name
	// TODO: make it return a new record instead of changing the uuids in place
	function instantiate(record: DatabaseRecord) {
		const uuid = extractUuid(record)
		if (!uuid) {
			console.error('record does not have a "uuid" to move to "templateUUID"', record)
			throw new Error('record does not have a "uuid" to move to "templateUUID"')
		}
		record.attributes?.push({ name: 'templateUuid', value: uuid })
		addNewUuid(record)
	}

	function extractUuid(record: DatabaseRecord): string | undefined {
		const uuidAttr = record.attributes?.find((atr) => atr.name === 'uuid')
		if (!uuidAttr) {
			return undefined
		}

		return uuidAttr.value
	}
	function addNewUuid(record: DatabaseRecord) {
		if (!record.attributes) {
			record.attributes = []
		}

		const newUuid = crypto.randomUUID()
		const uuidAttrIndex = record.attributes.findIndex((atr) => atr.name === 'uuid')

		const hasUuid = uuidAttrIndex >= 0

		if (hasUuid) {
			record.attributes[uuidAttrIndex].value = newUuid
		} else {
			record.attributes.push({ name: 'uuid', value: newUuid })
		}
	}

	async function findOneRecordByAttribute(
		tagName: string,
		attr: Attribute,
	): Promise<DatabaseRecord | undefined> {
		return findRecordByAttribute(db, tagName, attr)
	}

	async function findChildRecords(record: DatabaseRecord): Promise<DatabaseRecord[]> {
		return findChildRecordsByTagName(record, [])
	}

	async function findChildRecordsByTagName(
		record: DatabaseRecord,
		tagNames: string[],
	): Promise<DatabaseRecord[]> {
		if (!record.children || record.children.length === 0) {
			return []
		}

		let includedChildrenRefs: Relationship[] = record.children
		if (tagNames.length > 0) {
			includedChildrenRefs = record.children.filter((child) => tagNames.includes(child.tagName))
		}
		const childRecords = await Promise.all(
			includedChildrenRefs.map(async (child) => {
				const table = child.tagName
				const id = child.id

				const childRecord = await db.table(table).get({ id })
				if (!childRecord) {
					console.warn('could not find element', { id, table })
				}
				return childRecord
			}),
		)
		return childRecords.filter(Boolean)
	}

	const DEPTH_TIL_BAY_CHILDREN = 3
	async function findChildRecordsWithinDepthAndGivenTagName(
		record: DatabaseRecord,
		depth = DEPTH_TIL_BAY_CHILDREN,
		childTagNames: string[] = [],
	): Promise<DatabaseRecord[]> {
		const allChildren: DatabaseRecord[] = []

		let parentNodes = [record]
		for (let currentLevel = 0; currentLevel < depth; currentLevel++) {
			const newParentElements: DatabaseRecord[] = []
			for (const parent of parentNodes) {
				const children = await findChildRecordsByTagName(parent, childTagNames)
				if (children.length === 0) {
					continue
				}
				newParentElements.push(...children)
				allChildren.push(...children)
			}
			parentNodes = [...newParentElements]
		}

		return allChildren
	}

	function close() {
		db.close()
	}
}

export function extractAttr(
	record: DatabaseRecord,
	name: string,
): Attribute | QualifiedAttribute | undefined {
	return record.attributes?.find((attr) => attr.name === name)
}

export function updateAttr(record: DatabaseRecord, name: string, value: string) {
	if (!record.attributes) {
		record.attributes = []
	}

	const attrIndex = record.attributes?.findIndex((attr) => attr.name === name)
	const hasAttr = attrIndex >= 0

	if (!hasAttr) {
		record.attributes.push({ name, value })
	} else {
		record.attributes[attrIndex].value = value
	}
}

export async function findRecordByAttribute(
	db: Dexie,
	tagName: string,
	attr: Attribute,
): Promise<DatabaseRecord | undefined> {
	try {
		const wantedRecord = await db
			.table<DatabaseRecord>(tagName)
			.filter((record) =>
				Boolean(record.attributes?.some((a) => a.name === attr.name && a.value === attr.value)),
			)
			.first()
		return wantedRecord
	} catch (err) {
		console.error({ msg: 'could not find record by attribute', tagName, attr, err })
	}

	return undefined
}
