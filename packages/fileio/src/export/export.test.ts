import { describe, expect, it } from 'vitest'
import Dexie from 'dexie'
// COMMON
import { tagNamesToSchema } from '@/common'
// FUNCTION TO TEST
import { exportFile } from './export.main'
// TYPES
import type { DatabaseRecord } from '@/common'

describe('Export', () => {
	describe('Feature', () => {
		type TestCase = {
			description: string
			databaseName: string
			databaseContent: { [tableName: string]: DatabaseRecord[] }
			expectedFileName: string
			expectedFileString: string
		}

		const randomUUID = crypto.randomUUID()

		const featureTests: TestCase[] = [
			{
				description: 'Export a simple document',
				databaseName: `export-test-1-${randomUUID}`,
				databaseContent: {
					SCL: [
						{
							id: '123',
							tagName: 'SCL',
							namespace: null,
							value: null,
							attributes: [{ name: 'version', value: '2007B' }],
							parent: null,
							children: [{ id: '456', tagName: 'IED' }],
						},
					],
					IED: [
						{
							id: '456',
							tagName: 'IED',
							namespace: null,
							value: null,
							attributes: [{ name: 'name', value: 'just the one' }],
							parent: {
								id: '123',
								tagName: 'SCL',
							},
							children: [],
						},
					],
				},
				expectedFileName: `export-test-1-${randomUUID}.scd`,
				expectedFileString: '<SCL version="2007B"><IED name="just the one"/></SCL>',
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(testCase: TestCase) {
			it(testCase.description, async () => {
				// Arrange

				// Act
				const databaseInstance = await getDatabaseInstance(
					testCase.databaseName,
					testCase.databaseContent,
				)

				await writeToDatabase(databaseInstance, testCase.databaseContent)
				databaseInstance.close()

				const file = await exportFile({
					databaseName: testCase.databaseName,
				})

				// Assert
				expect(file.filename).toBe(testCase.expectedFileName)
				const fileString = new XMLSerializer().serializeToString(file.xmlDocument)
				expect(fileString).toBe(testCase.expectedFileString)

				// Cleanup
				await databaseInstance.delete()
			})
		}
	})
})

async function getDatabaseInstance(
	databaseName: string,
	data: { [tableName: string]: DatabaseRecord[] },
): Promise<Dexie> {
	const databaseInstance = new Dexie(databaseName)
	const schema = tagNamesToSchema(Object.keys(data))
	databaseInstance.version(1).stores(schema)
	await databaseInstance.open()
	return databaseInstance
}

async function writeToDatabase(
	databaseInstance: Dexie,
	data: { [tableName: string]: DatabaseRecord[] },
): Promise<void[]> {
	return Promise.all(
		Object.entries(data).map(async ([tableName, records]) => {
			const currentTable = databaseInstance.table(tableName)
			await databaseInstance.transaction('rw', currentTable, () => {
				return currentTable.bulkAdd(records)
			})
		}),
	)
}
