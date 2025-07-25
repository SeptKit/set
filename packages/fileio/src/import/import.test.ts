import { describe, expect, it } from 'vitest'
import { importXmlFiles } from './import.main'

describe('Import', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			fileContent: string
			expectedFileName: string
			expectedElementCounts: { [tableName: string]: number }
		}

		const featureTests: TestCase[] = [
			{
				desc: 'first test',
				fileContent: '<SCL><IED name="just the one"></IED></SCL>',
				expectedFileName: 'test',
				expectedElementCounts: {
					IED: 1,
				},
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				const file = new File([tc.fileContent], 'test.scd', {
					type: 'text/plain',
				})

				// Act
				const fileNames = await importXmlFiles({ files: [file] })
				// Note: The timeout is needed beause sometimes `importXmlFiles``
				// return too early
				await new Promise((r) => setTimeout(r, 1_00))

				// Assert

				expect(fileNames).toContain(tc.expectedFileName)

				const db = await openDatabase('test')
				for (const tableName of Object.keys(tc.expectedElementCounts)) {
					const expectedCount = tc.expectedElementCounts[tableName]
					const nrOfElements = await getElementCountOfTable(db, tableName)
					expect(nrOfElements).toEqual(expectedCount)
				}

				// Cleanup
				db.close()
				await deleteDatabase('test')
			})
		}
	})
})

function openDatabase(dbName: string): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName)

		request.onerror = () => reject(request.error)
		request.onsuccess = () => resolve(request.result)

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			// Create object stores if they don't exist
			if (!db.objectStoreNames.contains(dbName)) {
				// throw new Error(JSON.stringify({ msg: 'database does not exist', dbName }))
			}
		}
	})
}

async function deleteDatabase(dbName: string): Promise<void> {
	const dbs = await indexedDB.databases()
	const hasDB = Boolean(dbs.find((db) => db.name === dbName))
	if (!hasDB) {
		return
	}

	return new Promise((resolve, reject) => {
		const request = indexedDB.deleteDatabase(dbName)
		request.onerror = () => reject(request.error)
		request.onsuccess = () => resolve()
	})
}

function getElementCountOfTable(db: IDBDatabase, tableName: string): Promise<number> {
	return new Promise((resolve, reject) => {
		// const tables = Array.from(db.objectStoreNames)
		// console.debug({ level: 'debug', msg: 'getelcount', tableName, tables })

		const transaction = db.transaction(tableName, 'readonly')
		const store = transaction.objectStore(tableName)
		const request = store.count()

		request.onerror = () => reject(request.error)
		request.onsuccess = () => resolve(request.result)
	})
}
