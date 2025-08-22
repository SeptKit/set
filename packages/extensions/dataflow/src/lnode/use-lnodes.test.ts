import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import Dexie from 'dexie'
import { useLNodes } from './use-lnodes'
import type { LNode } from '@/lnode/lnode'
import { importXmlFiles, type DatabaseRecord } from '@septkit/fileio'

// XML Test Data
const sclData = `
<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
  <LNode id="l1" iedName="PIU" ldInst="CB" lnClass="XCBR" lnInst="1" lnType="LT1" prefix="P1">
    <Private type="eIEC61850-6-100">
      <eIEC61850-6-100:DOS desc="Trip (electrical protection function)" name="Tr">
        <eIEC61850-6-100:DAS desc="General Trip" name="general">
            <eIEC61850-6-100:SubscriberLNode inputName="Trip" pLN="XCBR" service="GOOSE"/>
        </eIEC61850-6-100:DAS>
      </eIEC61850-6-100:DOS>
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

	afterAll(() => {
		db.close()
	})

	it('enrichWithDataObjects finds DOs by LNodeType', async () => {
		// Arrange
		const lnodeSdk = useLNodes(db)
		// Act: Enrich LNodes with DataObjects
		const result = await lnodeSdk.enrichWithDataObjects(lnodes)
		// Assert: Check if DataObjects are enriched correctly
		expect(result[0].dataObjects.map((doj) => doj.name)).toContain('Beh')
		expect(result[0].dataObjects.map((doj) => doj.name)).toContain('Pos')
	})

	it('enrichWithDataAttributes finds DAs by DOType', async () => {
		// Arrange
		const lnodeSdk = useLNodes(db)
		// Act: Enrich LNodes with DataObjects and DataAttributes
		const lnodesWithDOs = await lnodeSdk.enrichWithDataObjects(lnodes)
		const result = await lnodeSdk.enrichWithDataAttributes(lnodesWithDOs)
		// Assert: Check if DataAttributes are enriched correctly
		expect(result[0].dataObjects[0].dataAttributes.map((daj) => daj.name)).toEqual(
			expect.arrayContaining(['stVal', 'q']),
		)
		expect(result[0].dataObjects[1].dataAttributes[0].name).toBe('ctlVal')
	})

	it('DataObjectSpecifications has DOS, DAS, and SubscriberLNode attached', async () => {
		// Arrange
		const lnodeSdk = useLNodes(db)
		// Act: Enrich LNodes with DataObjectSpecifications
		const result = await lnodeSdk.enrichWithDataObjectSpecifications(lnodes)

		// Assert: DOS, DAS, and SubscriberLNode are present
		expect(result[0].dataObjectSpecifications?.length).toBeGreaterThanOrEqual(1)

		const dosSpec = result[0].dataObjectSpecifications![0]
		expect(dosSpec.name).toBe('Tr')
		expect(dosSpec.dataAttributeSpecification?.length).toBeGreaterThanOrEqual(1)

		const dasSpec = dosSpec.dataAttributeSpecification[0]
		expect(dasSpec.name).toBe('general')

		expect(dasSpec.subscriberLNode).toBeDefined()
		expect(dasSpec.subscriberLNode?.inputName).toBe('Trip')
		expect(dasSpec.subscriberLNode?.pLN).toBe('XCBR')
		expect(dasSpec.subscriberLNode?.service).toBe('GOOSE')
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
		DAS: 'id',
		SubscriberLNode: 'id',
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
