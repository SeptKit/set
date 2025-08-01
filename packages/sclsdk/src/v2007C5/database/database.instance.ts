import Dexie from 'dexie'
// CONSTANTS
import { DATABASE_DEFAULT_SCHEMA } from './database.constants'
import { DEFINITION } from '../standard/standard.definition'
// TYPES
import { DatabaseInstance } from './database.types'

//====== PUBLIC FUNCTIONS ======//

/**
 * Init an empty indexedDB database
 * @param dbName Name of the database to initialize
 * @returns Dexie database instance
 */
export function initializeDatabaseInstance(params: { databaseName: string }) {
	const { databaseName } = params

	const databaseInstance = new Dexie(databaseName) as DatabaseInstance
	const TAG_NAMES = Object.keys(DEFINITION)
	const schema = tagNamesToSchema([...TAG_NAMES])
	databaseInstance.version(1).stores(schema)
	return databaseInstance
}

/**
 * Generate the schema for the database based on TAG_NAMES
 * @returns Schema for the database based on TAG_NAMES
 */
export function tagNamesToSchema(tagNames: string[]): Record<string, string> {
	return tagNames.reduce(
		(schema, tagName) => {
			schema[tagName] = DATABASE_DEFAULT_SCHEMA
			return schema
		},
		{} as Record<string, string>,
	)
}
