// src/assets/dbInit.ts

import Dexie from 'dexie'

export function initializeDatabaseInstance(dbName: string): Dexie {
	const db = new Dexie(dbName)
	db.version(1).stores({
		LNode: 'id,tagName,parent,children', // WIP
	})
	return db
}
