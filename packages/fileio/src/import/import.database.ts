import Dexie from 'dexie'
// COMMON
import { tagNamesToSchema, DATABASE_DEFAULT_SCHEMA, TAG_NAMES } from '@/common'
// TYPES
import { NewRelationship } from './import.types'
import { DatabaseRecord, DatabaseInstance, AvailableTagName } from '@/common/common.types'

//====== PUBLIC FUNCTIONS ======//

/**
 * Init an empty indexedDB database
 * @param dbName Name of the database to initialize
 * @returns Dexie database instance
 */
export function initializeDatabaseInstance(dbName: string) {
	const databaseInstance = new Dexie(dbName) as DatabaseInstance
	const schema = tagNamesToSchema([...TAG_NAMES])
	databaseInstance.version(1).stores(schema)
	return databaseInstance
}

/**
 * Add a batch of records to a specific table in the database
 * @param databaseInstance Dexie database instance
 * @param tagName Name of the table to add records to
 * @param records Array of records to add
 */
export async function bulkAddRecords(params: {
	databaseInstance: DatabaseInstance
	tagName: string
	records: DatabaseRecord[]
}): Promise<void> {
	const currentTable = params.databaseInstance.table(params.tagName)
	await params.databaseInstance.transaction('rw', currentTable, async () => {
		await currentTable.bulkAdd(params.records)
	})
}

export async function bulkUpdateRelationships(params: {
	databaseInstance: DatabaseInstance
	parentTagName: string
	relationshipRecords: NewRelationship[]
}) {
	const currentTable = params.databaseInstance.table(params.parentTagName)

	const parentIds = params.relationshipRecords.map((child) => child.parentId)

	await params.databaseInstance.transaction('rw', currentTable, async () => {
		const recordsToUpdate = await currentTable.bulkGet(parentIds)

		const recordsFormattedForBulkUpdate = recordsToUpdate.map((record, index) => {
			return {
				key: record.id,
				changes: {
					children: [
						...record.children,
						{
							id: params.relationshipRecords[index].childId,
							tagName: params.relationshipRecords[index].childTagName,
						},
					],
				},
			}
		})

		await currentTable.bulkUpdate(recordsFormattedForBulkUpdate)
	})
}

/**
 * Create all remaining tables in the database based on the provided tag names
 * @param databaseInstance Dexie database instance
 * @param tagNames Array of table names to create
 */
export async function bulkCreateTables(params: {
	databaseInstance: DatabaseInstance
	tagNames: string[]
}) {
	const { databaseInstance, tagNames } = params

	databaseInstance.close()

	const databaseInstanceCurrentVersion = databaseInstance.verno

	const previousSchema = databaseInstance.tables.reduce((acc, table) => {
		acc[table.name] = DATABASE_DEFAULT_SCHEMA
		return acc
	}, {} as Record<string, string>)

	const additionalSchema = tagNames.reduce((acc, tagName) => {
		acc[tagName] = DATABASE_DEFAULT_SCHEMA
		return acc
	}, {} as Record<string, string>)

	const newSchema = {
		...previousSchema,
		...additionalSchema,
	}

	databaseInstance.version(databaseInstanceCurrentVersion + 1).stores(newSchema)
	databaseInstance.open()
}
