// src/assets/useLNodeRecords.ts

import type {
	//DatabaseInstance,
	DatabaseRecord,
} from '../../node_modules/@septkit/fileio/dist/common/common.types'

import Dexie from 'dexie'

// Get all LNode records from the database
export async function getAllLNodes(db: Dexie): Promise<DatabaseRecord[]> {
	const table = db.table<DatabaseRecord>('LNode')
	return await table.toArray()
}

// Get a specific LNode with its children
// This function recursively fetches all children of the given LNode
export async function getLNodeWithChildren(
	db: Dexie,
	lnode: DatabaseRecord,
): Promise<{ lnode: DatabaseRecord; children: DatabaseRecord[] }> {
	async function fetchChildren(record: DatabaseRecord): Promise<DatabaseRecord[]> {
		if (!record.children || record.children.length === 0) return []
		const all: DatabaseRecord[] = []
		for (const childRef of record.children) {
			const child = await db.table<DatabaseRecord>(childRef.tagName).get(childRef.id)
			if (child) {
				all.push(child)
				const subChildren = await fetchChildren(child)
				all.push(...subChildren)
			}
		}
		return all
	}
	const children = await fetchChildren(lnode)
	return { lnode, children }
}
