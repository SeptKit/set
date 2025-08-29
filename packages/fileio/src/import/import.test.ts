import { describe, expect, it } from 'vitest'
import Dexie from 'dexie'
// FUNCTION TO TEST
import { importXmlFiles } from './import.main'
// HANDLERS
import { handleExpectedElementCounts, handleExpectedRelationships } from './import.test.handler'
// TYPES
import type { TestCase } from './import.test.types'
import { DatabaseInstance } from '@/common/common.types'

describe('Import', () => {
	describe('Feature', () => {
		const randomUUID = crypto.randomUUID()

		const featureTests: TestCase[] = [
			{
				description: 'Test with a single IED element',
				fileName: `test1-${randomUUID}.scd`,
				fileContent: '<SCL><IED name="just the one"></IED></SCL>',
				expectedFileName: `test1-${randomUUID}`,
				expectedElementCounts: {
					IED: 1,
				},
			},
			{
				description: 'Test with a new element with namespace',
				fileName: `test2-${randomUUID}.scd`,
				fileContent: `
					<SCL xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100" version="2007" revision="C" release="5">
						<IED name="just the one"></IED>
						<eIEC61850-6-100:NewElementWithNamespace>with a text</eIEC61850-6-100:NewElementWithNamespace>
					</SCL>
				`,
				expectedFileName: `test2-${randomUUID}`,
				expectedElementCounts: {
					IED: 1,
					NewElementWithNamespace: 1,
				},
			},
			{
				description: 'Test with multiple IED elements',
				fileName: `test3-${randomUUID}.scd`,
				fileContent: `
					<SCL>
						<IED name="first"></IED>
						<IED name="second"></IED>
					</SCL>
				`,
				expectedFileName: `test3-${randomUUID}`,
				expectedElementCounts: {
					IED: 2,
				},
			},
			{
				description: 'Test with empty SCL element',
				fileName: `test4-${randomUUID}.scd`,
				fileContent: '<SCL></SCL>',
				expectedFileName: `test4-${randomUUID}`,
				expectedElementCounts: {
					SCL: 1,
				},
			},
			{
				description: 'Test with empty file content',
				fileName: `test5-${randomUUID}.scd`,
				fileContent: '',
				expectedFileName: `test5-${randomUUID}`,
				expectedElementCounts: undefined,
			},
			{
				description: 'Test parent and child relationships',
				fileName: `test1-${randomUUID}.scd`,
				fileContent: '<SCL uuid="123"><IED uuid="456" name="just the one"></IED></SCL>',
				expectedFileName: `test1-${randomUUID}`,
				expectedElementCounts: {
					SCL: 1,
					IED: 1,
				},
				expectedRelationships: {
					SCL: [
						{
							uuid: '123',
							parent: null,
							children: [{ uuid: '456', tagName: 'IED' }],
						},
					],
					IED: [
						{
							uuid: '456',
							parent: { uuid: '123', tagName: 'SCL' },
							children: [],
						},
					],
				},
			},
			{
				description:
					'Import file with LNode, overwrite with different lnClass (should only keep latest)',
				fileName: 'overwrite-lnode.scd',
				fileContent: `
        <SCL>
            <LNode lnClass="TCTR" id="overwriteTest"></LNode>
        </SCL>
    `,
				expectedFileName: 'overwrite-lnode',
				expectedElementCounts: {
					LNode: 1,
				},
			},
			{
				description: 'Overwrite same file: only new LNode with lnClass=PTRC remains',
				fileName: 'overwrite-lnode.scd',
				fileContent: `
        <SCL>
            <LNode lnClass="PTRC" id="overwriteTest"></LNode>
        </SCL>
    `,
				expectedFileName: 'overwrite-lnode',
				expectedElementCounts: {
					LNode: 1,
				},
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(testCase: TestCase) {
			it(testCase.description, async () => {
				// Arrange
				const file = new File([testCase.fileContent], testCase.fileName, {
					type: 'text/plain',
				})

				// Act
				const fileNames = await importXmlFiles({ files: [file] })

				const databaseInstance = new Dexie(testCase.expectedFileName) as DatabaseInstance

				// Assert
				if (testCase.expectedElementCounts)
					await handleExpectedElementCounts(databaseInstance, fileNames, testCase)
				else await expect(databaseInstance.open()).rejects.toThrow(Dexie.NoSuchDatabaseError)

				if (testCase.expectedRelationships) {
					await handleExpectedRelationships(databaseInstance, testCase)
				}

				// Cleanup
				databaseInstance.close()
				await databaseInstance.delete()
			})
		}

		it('after overwrite-lnode.scd imported twice, only LNode "PTRC" remains', async () => {
			// Arrange
			const firstXml = `
                <SCL>
                    <LNode lnClass="TCTR" id="overwriteTest"></LNode>
                </SCL>
            `
			const secondXml = `
                <SCL>
                    <LNode lnClass="PTRC" id="overwriteTest"></LNode>
                </SCL>
            `
			const fileName = 'overwrite-lnode.scd'
			const dbName = 'overwrite-lnode'

			// Act: Import first file
			const firstFile = new File([firstXml], fileName, { type: 'text/xml' })
			await importXmlFiles({ files: [firstFile] })

			// import second file with same name (should overwrite)
			const secondFile = new File([secondXml], fileName, { type: 'text/xml' })
			await importXmlFiles({ files: [secondFile] })

			const db = new Dexie(dbName)
			await db.open()

			// Assert: only one LNode with lnClass=PTRC exists in DB
			const lNodes = await db.table('LNode').toArray()
			expect(lNodes.length).toBe(1)

			const lnClass = lNodes[0].attributes?.find(
				(a: { name: string }) => a.name === 'lnClass',
			)?.value
			expect(lnClass).toBe('PTRC')

			// Cleanup
			db.close()
			await Dexie.delete(dbName)
		})
	})
})
