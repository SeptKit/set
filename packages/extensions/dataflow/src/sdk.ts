import type Dexie from 'dexie'
import type { DatabaseRecord } from '@septkit/fileio'
import type { PartialBy } from './types/types'

export function useSDK(db: Dexie) {
	return {
		addRecord,
		findChildRecordsByTagName,
		ensureRelationship,
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
}

export type SDK = ReturnType<typeof useSDK>
