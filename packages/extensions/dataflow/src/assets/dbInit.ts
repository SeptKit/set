// src/assets/dbInit.ts

import Dexie from 'dexie'

export function initializeDatabaseInstance(dbName: string): Dexie {
	const db = new Dexie(dbName)
	db.version(1).stores({
		LNode: 'id,tagName,parent,children',
		Private: 'id,tagName,parent,children',
		LNodeType: 'id,tagName,parent,children',
		DO: 'id,tagName,parent,children',
		DOType: 'id,tagName,parent,children',
		DA: 'id,tagName,parent,children',
	})
	return db
}
