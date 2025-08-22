import type Dexie from 'dexie'
import type { Attribute, DatabaseRecord, QualifiedAttribute } from '@septkit/fileio'
import type { PartialBy } from './types'

export function useDatabase(db: Dexie) {
	return {
		addRecord,
		findChildRecordsByTagName,
		ensureRelationship,
		findParentRecordsWithinDepthAndGivenTagName,
		db,
	}

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

	async function findChildRecordsByTagName(
		record: DatabaseRecord,
		tagName: string,
	): Promise<DatabaseRecord[]> {
		if (!record.children || record.children.length === 0) return []

		const childRecords = await Promise.all(
			record.children
				.filter((child) => child.tagName === tagName)
				.map(async (child) => {
					const table = child.tagName
					const id = child.id

					const childRecord = await db.table(table).get({ id })
					return childRecord
				}),
		)

		return childRecords
	}

	async function findParentRecordsWithinDepthAndGivenTagName(
		record: DatabaseRecord,
		depth: number,
		tagNames: string[] = [],
	): Promise<DatabaseRecord[]> {
		const allParents: DatabaseRecord[] = []

		let currentRecord = record

		for (let currentLevel = 0; currentLevel < depth; currentLevel++) {
			if (!currentRecord.parent) {
				return allParents
			}

			const parent = await db
				.table<DatabaseRecord>(currentRecord.parent.tagName)
				.get(currentRecord.parent.id)

			if (!parent) {
				const errMsg = {
					msg: 'Parent record not found',
					table: currentRecord.parent.tagName,
					id: currentRecord.parent.id,
				}
				console.error(errMsg)
				throw new Error(JSON.stringify(errMsg))
			}

			if (tagNames.length == 0 || (tagNames.length > 0 && tagNames.includes(parent.tagName))) {
				allParents.push(parent)
			}

			currentRecord = parent
		}

		return allParents
	}
}

export type DatabaseSDK = ReturnType<typeof useDatabase>

export function extractAttr(
	record: DatabaseRecord,
	name: string,
): Attribute | QualifiedAttribute | undefined {
	return record.attributes?.find((attr) => attr.name === name)
}

// Helper function to get an attribute value from a record
export function extractAttributeValue(
	record: DatabaseRecord | undefined,
	name: string,
): string | undefined {
	return record?.attributes?.find((a) => a.name === name)?.value
}
