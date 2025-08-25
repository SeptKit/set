import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import Dexie from 'dexie'
import { importXmlFiles, type DatabaseRecord } from '@septkit/fileio'
import { useConnections } from './use-connections'

// XML Test Data
const sclData = `
<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
  <LNode iedName="PIU" ldInst="CT" lnClass="TCTR" lnInst="11" lnType="tctr_7_4_B2007" prefix="I01A"
    uuid="189bdcc1-69d0-41ea-a0d7-30d76bfc41f0" templateUUID="123e4567-e89b-12d3-a456-789012345678">
    <Private type="eIEC61850-6-100">
      <eIEC61850-6-100:LNodeSpecNaming sIedName="PIU" sLdInst="CT" sLnClass="TCTR" sLnInst="11"
        sPrefix="I01A" />
      <eIEC61850-6-100:DOS desc="Sampled, non-three-phase current of the current transformer."
        name="AmpSv">
        <eIEC61850-6-100:SDS name="instMag">
          <eIEC61850-6-100:DAS desc="AmpSv.instMag.i[MX]" name="i" />
        </eIEC61850-6-100:SDS>
      </eIEC61850-6-100:DOS>
    </Private>
  </LNode>
  <LNode iedName="P1" ldInst="P51" lnClass="PIOC" lnInst="1" lnType="PIOC_V001" prefix=""
    uuid="0033a7f6-8d64-449f-9def-a5103fbb06e8" templateUUID="123e4567-e89b-12d3-a456-789012345678">
    <Private type="eIEC61850-6-100">
      <eIEC61850-6-100:DOS name="Op">
        <eIEC61850-6-100:DAS desc="Operate" name="general">
          <eIEC61850-6-100:SubscriberLNode inputName="Operate" pLN="IHMI" service="Report" />
        </eIEC61850-6-100:DAS>
      </eIEC61850-6-100:DOS>
      <eIEC61850-6-100:LNodeInputs>
        <eIEC61850-6-100:SourceRef pDO="AmpSv" pLN="TCTR"
          resourceName="TEMPLATE/TEMPLATE/TEMPLATE/P51 Function/PhsA" pDA="instMag.i" input="PhsA"
          inputInst="1" service="SMV"
          source="TEMPLATE/TEMPLATE/TEMPLATE/CT Function/PhsA/I01ATCTR11.AmpSv.instMag.i"
          sourceLNodeUuid="189bdcc1-69d0-41ea-a0d7-30d76bfc41f0" sourceDoName="AmpSv"
          sourceDaName="instMag.i" uuid="SRCREF5"
          templateUUID="123e4567-e89b-12d3-a456-789012345678" />
        <eIEC61850-6-100:SourceRef pDO="AmpSv" pLN="TCTR"
          resourceName="TEMPLATE/TEMPLATE/TEMPLATE/P51 Function/PhsA" pDA="q" input="PhsA"
          inputInst="1" service="SMV"
          source="TEMPLATE/TEMPLATE/TEMPLATE/CT Function/PhsA/I01ATCTR11.AmpSv.q"
          sourceLNodeUuid="189bdcc1-69d0-41ea-a0d7-30d76bfc41f0" sourceDoName="AmpSv"
          sourceDaName="q"
          uuid="SRCREF6" templateUUID="123e4567-e89b-12d3-a456-789012345678" />
      </eIEC61850-6-100:LNodeInputs>
    </Private>
  </LNode>
  <LNode iedName="P1" ldInst="P51" lnClass="PTRC" lnInst="1" lnType="PTRC_TR_SET_V002" prefix=""
    uuid="9c00571a-133d-4eba-a71a-6a0380ac6169" templateUUID="123e4567-e89b-12d3-a456-789012345678">
    <Private type="eIEC61850-6-100">
      <eIEC61850-6-100:DOS desc="Trip (electrical protection function)" name="Tr">
        <eIEC61850-6-100:DAS desc="General Trip" name="general">
          <eIEC61850-6-100:SubscriberLNode inputName="Trip" pLN="XCBR" service="GOOSE" />
        </eIEC61850-6-100:DAS>
      </eIEC61850-6-100:DOS>
      <eIEC61850-6-100:LNodeInputs>
        <eIEC61850-6-100:SourceRef pDO="Op" pLN="PIOC" pDA="general" input="Operate" inputInst="1"
          service="Internal"
          source="TEMPLATE/TEMPLATE/TEMPLATE/P51 Function/Overcurrent/PIOC1.Op.general"
          sourceLNodeUuid="0033a7f6-8d64-449f-9def-a5103fbb06e8" sourceDoName="Op"
          sourceDaName="general" uuid="SRCREF13" templateUUID="123e4567-e89b-12d3-a456-789012345678" />
      </eIEC61850-6-100:LNodeInputs>
    </Private>
  </LNode>
</SCL>
`

describe('useConnections to map the XML data', () => {
	let db: Dexie

	beforeEach(async () => {
		db = await loadMinimalTestDB()
	})

	afterAll(() => {
		db.close()
	})

	it('useConnections finds SourceRef elements and maps to Connection objects', async () => {
		// Arrange
		const connectionSdk = useConnections(db)

		// Act: Find existing Connections
		const result = await connectionSdk.findAllExistingFromDB()

		// Assert: Check if Connections are mapped correctly
		expect(result.length).toBe(3)

		// Sort the result for deterministic assertion
		result.sort((a, b) => a.sourceDataAttribute!.localeCompare(b.sourceDataAttribute!))

		const allLnodes = await db.table<DatabaseRecord>('LNode').toArray()
		const tctrLNode = allLnodes.find(
			(l) =>
				l.attributes?.find((a) => a.name === 'uuid')?.value ===
				'189bdcc1-69d0-41ea-a0d7-30d76bfc41f0',
		)
		const piocLNode = allLnodes.find(
			(l) =>
				l.attributes?.find((a) => a.name === 'uuid')?.value ===
				'0033a7f6-8d64-449f-9def-a5103fbb06e8',
		)
		const ptrcLNode = allLnodes.find(
			(l) =>
				l.attributes?.find((a) => a.name === 'uuid')?.value ===
				'9c00571a-133d-4eba-a71a-6a0380ac6169',
		)

		expect(result[0].sourceLNodeId).toBe(piocLNode!.id)
		expect(result[0].dataflowType).toBe('Internal')
		expect(result[0].sourceDataObject).toBe('Op')
		expect(result[0].sourceDataAttribute).toBe('general')
		expect(result[0].input).toBe('Operate')
		expect(result[0].inputInstance).toBe('1')
		expect(result[0].destinationLNodeId).toBe(ptrcLNode!.id)

		expect(result[1].sourceLNodeId).toBe(tctrLNode!.id)
		expect(result[1].dataflowType).toBe('SMV')
		expect(result[1].sourceDataObject).toBe('AmpSv')
		expect(result[1].sourceDataAttribute).toBe('instMag.i')
		expect(result[1].input).toBe('PhsA')
		expect(result[1].inputInstance).toBe('1')
		expect(result[1].destinationLNodeId).toBe(piocLNode!.id)

		expect(result[2].sourceLNodeId).toBe(tctrLNode!.id)
		expect(result[2].dataflowType).toBe('SMV')
		expect(result[2].sourceDataObject).toBe('AmpSv')
		expect(result[2].sourceDataAttribute).toBe('q')
		expect(result[2].input).toBe('PhsA')
		expect(result[2].inputInstance).toBe('1')
		expect(result[2].destinationLNodeId).toBe(piocLNode!.id)
	})
})

async function loadMinimalTestDB() {
	const sclFile = new File([sclData], 'test.ssd', { type: 'text/xml' })
	const [fileName] = await importXmlFiles({ files: [sclFile] })
	localStorage.setItem('currentActiveFileDatabaseName', fileName)

	const db = new Dexie(fileName)
	db.version(1).stores({
		LNode: 'id',
		Private: 'id',
		SourceRef: 'id',
		LNodeInputs: 'id',
	})
	await db.open()
	return db
}
