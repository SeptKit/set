import type Dexie from 'dexie'
import type {
	Attribute,
	DatabaseRecord,
	QualifiedAttribute,
} from '../node_modules/@septkit/fileio/dist/common/common.types'

export function useSDK(db: Dexie) {
	return {
		findChildRecrods,
		templateify,
		ensureRelationship,
		addRecord,
	}

	/**
	 *
	 * @param record the added record
	 */
	async function addRecord(record: DatabaseRecord): Promise<DatabaseRecord> {
		try {
			const addedId = await db.table<DatabaseRecord>(record.tagName).add(record)
			const addedRecord = await db.table<DatabaseRecord>(record.tagName).get(addedId)
			if (!addedRecord) {
				const errMsg = { msg: 'could not find added record', table: record.tagName, addedId }
				console.error(errMsg)
				throw new Error(JSON.stringify(errMsg))
			}

			return addedRecord
		} catch (err) {
			const errMsg = { msg: 'could not add record', db: db.name, table: record.tagName, record }
			console.error(errMsg)
			throw new Error(JSON.stringify(errMsg))
		}
	}

	async function ensureRelationship(parent: DatabaseRecord, child: DatabaseRecord) {
		const parentHasChild = parent.children?.some(
			(c) => c.id === child.id && c.tagName === c.tagName,
		)
		const childHasParent =
			child.parent?.id === parent.id && child.parent?.tagName === parent.tagName

		if (!parentHasChild) {
			parent.children?.push({
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

	// TODO: fsdReference with file name
	function templateify(record: DatabaseRecord) {
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

		const hasUuid = uuidAttrIndex < 0

		if (!hasUuid) {
			record.attributes[uuidAttrIndex].value = newUuid
		} else {
			record.attributes.push({ name: 'uuid', value: newUuid })
		}
	}

	async function findChildRecrods(record: DatabaseRecord): Promise<DatabaseRecord[]> {
		if (!record.children || record.children.length === 0) return []

		const childRecords: DatabaseRecord[] = []

		for (const child of record.children) {
			const table = child.tagName
			const id = child.id

			const childRecord = await db.table(table).get({ id })
			childRecords.push(childRecord)

			const recursiveChildren = await findChildRecrods(childRecord)
			childRecords.push(...recursiveChildren)
		}

		return childRecords
	}
}

export function extractAttr(
	record: DatabaseRecord,
	name: string,
): Attribute | QualifiedAttribute | undefined {
	return record.attributes?.find((attr) => attr.name === name)
}

export async function findRecordByAttribute(
	db: Dexie,
	tagName: string,
	attr: Attribute,
): Promise<DatabaseRecord | undefined> {
	const wantedRecord = await db
		.table<DatabaseRecord>(tagName)
		.filter((record) =>
			Boolean(record.attributes?.some((a) => a.name === attr.name && a.value === attr.value)),
		)
		.first()

	return wantedRecord
}
