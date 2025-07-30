import { expect } from 'vitest'
// TYPES
import type { TestCase } from './import.test.types'
import { DatabaseInstance, DatabaseRecord } from '@/common/common.types'

export async function handleExpectedElementCounts(
	databaseInstance: DatabaseInstance,
	filenames: string[],
	testCase: TestCase,
) {
	if (!testCase.expectedElementCounts) return

	await databaseInstance.open()

	expect(filenames).toContain(testCase.expectedFileName)

	for (const tableName of Object.keys(testCase.expectedElementCounts)) {
		const expectedCount = testCase.expectedElementCounts[tableName]
		const numberOfElements = await databaseInstance.table(tableName).count()
		expect(numberOfElements).toEqual(expectedCount)
	}
}

export async function handleExpectedRelationships(
	databaseInstance: DatabaseInstance,
	testCase: TestCase,
) {
	if (!testCase.expectedRelationships) return

	await databaseInstance.open()

	for (const [tableName, relationships] of Object.entries(testCase.expectedRelationships)) {
		const records: DatabaseRecord[] = await databaseInstance.table(tableName).toArray()
		expect(records.length).toBe(relationships.length)

		for (const relationship of relationships) {
			const currentRecord = await findRecordByUuid(databaseInstance, tableName, relationship.uuid)
			expect(currentRecord).toBeDefined()

			// Parent check
			if (relationship.parent) {
				const parentRecord = await findRecordByUuid(
					databaseInstance,
					relationship.parent.tagName,
					relationship.parent.uuid,
				)
				expect(parentRecord).toBeDefined()
				expect(currentRecord?.parent).toEqual({
					id: parentRecord?.id,
					tagName: relationship.parent.tagName,
				})
			} else {
				expect(currentRecord?.parent).toBeNull()
			}

			// Children check
			expect(currentRecord?.children?.length).toBe(relationship.children.length)
			for (const child of relationship.children) {
				const childRecord = await findRecordByUuid(databaseInstance, child.tagName, child.uuid)
				expect(childRecord).toBeDefined()
				expect(currentRecord?.children).toContainEqual({
					id: childRecord?.id,
					tagName: child.tagName,
				})
			}
		}
	}
}

//====== HELPERS ======//

async function findRecordByUuid(
	databaseInstance: DatabaseInstance,
	table: string,
	uuid: string,
): Promise<DatabaseRecord | undefined> {
	const records: DatabaseRecord[] = await databaseInstance.table(table).toArray()
	return records.find((record) =>
		record.attributes?.some((attribute) => attribute.name === 'uuid' && attribute.value === uuid),
	)
}
