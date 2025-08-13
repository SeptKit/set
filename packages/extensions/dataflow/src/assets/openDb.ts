// src/assets/dbInit.ts

import Dexie from 'dexie'

export async function openDatabase(dbName: string): Promise<Dexie> {
	try {
		const db = new Dexie(dbName)
		await db.open()
		return db
	} catch (error) {
		console.error('Error opening database:', error)
		throw error
	}
}
