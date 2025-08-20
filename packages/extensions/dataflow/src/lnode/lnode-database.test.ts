import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { createLNodeSDK } from './lnode-database'
import type { LNode } from '@/lnode/lnode'
import { importXmlFiles, type DatabaseRecord } from '@septkit/fileio'

// XML Test Data
const sclData = `
<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
  <LNode id="l1" iedName="PIU" ldInst="CB" lnClass="XCBR" lnInst="1" lnType="LT1" prefix="P1">
    <Private type="eIEC61850-6-100">
      <eIEC61850-6-100:DOS desc="DOS Description" name="AmpSv"/>
    </Private>
  </LNode>
  <DataTypeTemplates>
    <LNodeType id="LT1" lnClass="XCBR">
      <DO id="do1" name="Beh" type="DOType1"/>
      <DO id="do2" name="Pos" type="DOType2"/>
    </LNodeType>
    <DOType id="DOType1">
      <DA id="da1" name="stVal" fc="ST" />
      <DA id="da2" name="q" fc="ST" />
    </DOType>
    <DOType id="DOType2">
      <DA id="da3" name="ctlVal" fc="CO" />
    </DOType>
  </DataTypeTemplates>
</SCL>
`

describe('use-lnode-records to map the XML', () => {
	let db: Dexie
	let lnodes: LNode[]
	beforeEach(async () => {
		db = await loadMinimalTestDB()
		const lnodeRecs = await db.table('LNode').toArray()
		expect(lnodeRecs.length).toBeGreaterThan(0)
		lnodes = lnodeRecs.map(mapToLNode)
	})

	it('enrichLNodesWithDataObjects finds DOs by LNodeType', async () => {
		// Arrange
		const lnodeSdk = createLNodeSDK(db)
		// Act: Enrich LNodes with DataObjects
		const result = await lnodeSdk.enrichLNodesWithDataObjects(lnodes)
		// Assert: Check if DataObjects are enriched correctly
		expect(result[0].dataObjects.map((doj) => doj.name)).toContain('Beh')
		expect(result[0].dataObjects.map((doj) => doj.name)).toContain('Pos')
	})

	it('enrichLNodesWithDataAttributes finds DAs by DOType', async () => {
		// Arrange
		const lnodeSdk = createLNodeSDK(db)
		// Act: Enrich LNodes with DataObjects and DataAttributes
		const lnodesWithDOs = await lnodeSdk.enrichLNodesWithDataObjects(lnodes)
		const result = await lnodeSdk.enrichLNodesWithDataAttributes(lnodesWithDOs)
		// Assert: Check if DataAttributes are enriched correctly
		expect(result[0].dataObjects[0].dataAttributes.map((daj) => daj.name)).toEqual(
			expect.arrayContaining(['stVal', 'q']),
		)
		expect(result[0].dataObjects[1].dataAttributes[0].name).toBe('ctlVal')
	})

	it('enrichLNodesWithDataObjectSpecifications finds DOS in Private', async () => {
		// Arrange
		const lnodeSdk = createLNodeSDK(db)
		// Act: Enrich LNodes with DataObjectSpecifications
		const result = await lnodeSdk.enrichLNodesWithDataObjectSpecifications(lnodes)
		// Assert: Check if DataObjectSpecifications are enriched correctly
		expect(result[0].dataObjectSpecifications?.length).toBeGreaterThanOrEqual(1)
		expect(result[0].dataObjectSpecifications?.[0].name).toBe('AmpSv')
		expect(result[0].dataObjectSpecifications?.[0].desc).toBe('DOS Description')
	})
})

async function loadMinimalTestDB() {
	const sclFile = new File([sclData], 'test.ssd', { type: 'text/xml' })
	const [fileName] = await importXmlFiles({ files: [sclFile] })
	localStorage.setItem('currentActiveFileDatabaseName', fileName)

	const db = new Dexie(fileName)
	db.version(1).stores({
		LNode: 'id',
		LNodeType: 'id',
		DO: 'id',
		DOType: 'id',
		DA: 'id',
		Private: 'id',
		DOS: 'id',
	})
	await db.open()
	return db
}

function mapToLNode(r: DatabaseRecord): LNode {
	return {
		id: r.id ?? '',
		uuid: '',
		iedName: r.attributes?.find((a) => a.name === 'iedName')?.value ?? '',
		lnType: r.attributes?.find((a) => a.name === 'lnType')?.value ?? '',
		prefix: r.attributes?.find((a) => a.name === 'prefix')?.value ?? '',
		lnClass: r.attributes?.find((a) => a.name === 'lnClass')?.value ?? '',
		lnInst: r.attributes?.find((a) => a.name === 'lnInst')?.value ?? '',
		dataObjects: [],
	}
}
