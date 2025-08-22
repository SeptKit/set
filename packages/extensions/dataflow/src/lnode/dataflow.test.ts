import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Dexie from 'dexie'
import { exportFile, importXmlFiles } from '@septkit/fileio'
import { useDataflow } from './dataflow'
import { createLNodeSDK } from './lnode-database'
import { DataflowType } from './connection'

// XML Test Data
const sclData = /*xml*/ `
<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
	<LNode iedName="P1" ldInst="P51" lnClass="PIOC" lnInst="1" lnType="PIOC_V001" prefix=""
		uuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
		templateUUID="123e4567-e89b-12d3-a456-789012345678">
		<Private type="eIEC61850-6-100">
			<eIEC61850-6-100:LNodeInputs/>
		</Private>
	</LNode>
	<LNode iedName="P1" ldInst="P51" lnClass="PTRC" lnInst="1" lnType="PTRC_TR_SET_V002"
		prefix="" uuid="9c00571a-133d-4eba-a71a-6a0380ac6169"
		templateUUID="123e4567-e89b-12d3-a456-789012345678">
		<Private type="eIEC61850-6-100">
			<eIEC61850-6-100:LNodeInputs/>
		</Private>
	</LNode>
  <DataTypeTemplates>
    <LNodeType id="PIOC_V001" lnClass="PIOC">
      <DO name="Op" type="ACT_V001" transient="false" />
      <DO name="Str" type="ACD_V003" transient="false" />
    </LNodeType>
    <LNodeType id="PTRC_TR_SET_V002" lnClass="PTRC">
      <DO desc="Trip (electrical protection function)" name="Tr" type="ACT_V001"
        transient="false" />
      <DO desc="Behaviour" name="Beh" type="ENS_BehaviourModeKind" transient="false" />
    </LNodeType>
    <DOType id="ACT_V001" cdc="ACT">
      <DA desc="general" bType="BOOLEAN" name="general" dchg="false" dupd="false" fc="ST"
        qchg="false" />
      <DA desc="quality" bType="Quality" name="q" dchg="false" dupd="false" fc="ST" qchg="false" />
      <DA desc="time" bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST" qchg="false" />
    </DOType>
    <DOType id="ACD_V003" cdc="ACD">
      <DA bType="BOOLEAN" name="phsA" dchg="false" dupd="false" fc="ST" qchg="false" />
      <DA bType="BOOLEAN" name="phsB" dchg="false" dupd="false" fc="ST" qchg="false" />
      <DA bType="BOOLEAN" name="phsC" dchg="false" dupd="false" fc="ST" qchg="false" />
    </DOType>
    <DOType id="ENS_BehaviourModeKind" cdc="ENS">
      <DA bType="Enum" name="stVal" type="BehaviourModeKind" dchg="false" dupd="false" fc="ST"
        qchg="false" />
      <DA bType="Quality" name="q" dchg="false" dupd="false" fc="ST" qchg="false" />
      <DA bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST" qchg="false" />
    </DOType>
  </DataTypeTemplates>
</SCL>
`

describe('create dataflow into XML', () => {
	let db: Dexie

	beforeEach(async () => {
		db = await loadMinimalTestDB()
	})

	afterEach(async () => {
		db.close()
		// Clean up the database because inserted data for the dataflows should not interfere with other tests
		await db.delete()
	})

	it('should create SourceRef element', async () => {
		// Note: we mock the randomUUID in order to be able to define expected output in a deterministic way
		crypto.randomUUID = createMockRandomUUID()

		// Arrange
		const lnodeSdk = createLNodeSDK(db)
		const lnodes = await lnodeSdk.findAllEnrichedFromDB()
		expect(lnodes.length).toBeGreaterThan(0)
		const dataflow = useDataflow(db)

		// Act: Create a dataflow
		const sendingLNode = lnodes.find((l) => l.uuid === '0033a7f6-8d64-449f-9def-a5103fbb06e8')!
		const receivingLNode = lnodes.find((l) => l.uuid === '9c00571a-133d-4eba-a71a-6a0380ac6169')!

		await dataflow.create(
			{
				type: DataflowType.GOOSE,
				signal: 'Str',
				attribute: 'phsA',
				inputName: 'Str',
				inputInstance: '1',
				includeQuality: false,
				includeTimestamp: false,
			},
			sendingLNode,
			receivingLNode,
		)

		// Assert: Check if SourceRef element was created
		const { xmlDocument } = await exportFile({ databaseName: 'test' })
		const xmlAsString = new XMLSerializer().serializeToString(xmlDocument).replace(/></g, '>\n<')

		// For some reason the export does not keep the <DataTypeTemplates> element at the end
		const expected = /*xml*/ `
			<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
				<LNode iedName="P1" ldInst="P51" lnClass="PIOC" lnInst="1" lnType="PIOC_V001" prefix=""
						uuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
						templateUUID="123e4567-e89b-12d3-a456-789012345678">
						<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:LNodeInputs />
						</Private>
				</LNode>
				<DataTypeTemplates>
						<LNodeType id="PIOC_V001" lnClass="PIOC">
								<DO name="Op" type="ACT_V001" transient="false" />
								<DO name="Str" type="ACD_V003" transient="false" />
						</LNodeType>
						<DOType id="ACT_V001" cdc="ACT">
								<DA desc="general" bType="BOOLEAN" name="general" dchg="false" dupd="false" fc="ST"
										qchg="false" />
								<DA desc="quality" bType="Quality" name="q" dchg="false" dupd="false" fc="ST"
										qchg="false" />
								<DA desc="time" bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST"
										qchg="false" />
						</DOType>
						<LNodeType id="PTRC_TR_SET_V002" lnClass="PTRC">
								<DO desc="Trip (electrical protection function)" name="Tr" type="ACT_V001"
										transient="false" />
								<DO desc="Behaviour" name="Beh" type="ENS_BehaviourModeKind" transient="false" />
						</LNodeType>
						<DOType id="ACD_V003" cdc="ACD">
								<DA bType="BOOLEAN" name="phsA" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="BOOLEAN" name="phsB" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="BOOLEAN" name="phsC" dchg="false" dupd="false" fc="ST" qchg="false" />
						</DOType>
						<DOType id="ENS_BehaviourModeKind" cdc="ENS">
								<DA bType="Enum" name="stVal" type="BehaviourModeKind" dchg="false" dupd="false"
										fc="ST" qchg="false" />
								<DA bType="Quality" name="q" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST" qchg="false" />
						</DOType>
				</DataTypeTemplates>
				<LNode iedName="P1" ldInst="P51" lnClass="PTRC" lnInst="1" lnType="PTRC_TR_SET_V002"
						prefix="" uuid="9c00571a-133d-4eba-a71a-6a0380ac6169"
						templateUUID="123e4567-e89b-12d3-a456-789012345678">
						<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:LNodeInputs>
										<eIEC61850-6-100:SourceRef pDO="Str" pLN="PIOC" pDA="phsA" input="Str" inputInst="1"
												service="GOOSE" sourceLNodeUuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
												sourceDoName="Str" sourceDaName="phsA" uuid="0-0-0-0-0" />
								</eIEC61850-6-100:LNodeInputs>
						</Private>
				</LNode>
			</SCL>
`

		const expectedXml = new DOMParser().parseFromString(expected, 'text/xml')
		const expectedXmlAsString = new XMLSerializer()
			.serializeToString(expectedXml)
			.replace(/>\s+</g, '>\n<')
			.trim()

		expect(xmlAsString, 'generatedXML: \n' + xmlAsString).toEqual(expectedXmlAsString)
	})
	it('should create multiple SourceRef elements if includeQuality and includeTimestamp are checked', async () => {
		// Note: we mock the randomUUID in order to be able to define expected output in a deterministic way
		crypto.randomUUID = createMockRandomUUID()

		// Arrange
		const lnodeSdk = createLNodeSDK(db)
		const lnodes = await lnodeSdk.findAllEnrichedFromDB()
		expect(lnodes.length).toBeGreaterThan(0)
		const dataflow = useDataflow(db)

		// Act: Create a dataflow
		const sendingLNode = lnodes.find((l) => l.uuid === '0033a7f6-8d64-449f-9def-a5103fbb06e8')!
		const receivingLNode = lnodes.find((l) => l.uuid === '9c00571a-133d-4eba-a71a-6a0380ac6169')!

		await dataflow.create(
			{
				type: DataflowType.REPORT,
				signal: 'Op',
				attribute: 'general',
				inputName: 'Op',
				inputInstance: '1',
				includeQuality: true,
				includeTimestamp: true,
			},
			sendingLNode,
			receivingLNode,
		)

		// Assert: Check if SourceRef elements were created
		const { xmlDocument } = await exportFile({ databaseName: 'test' })
		const xmlAsString = new XMLSerializer().serializeToString(xmlDocument).replace(/></g, '>\n<')

		// For some reason the export does not keep the <DataTypeTemplates> element at the end
		const expected = /*xml*/ `
			<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
				<LNode iedName="P1" ldInst="P51" lnClass="PIOC" lnInst="1" lnType="PIOC_V001" prefix=""
						uuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
						templateUUID="123e4567-e89b-12d3-a456-789012345678">
						<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:LNodeInputs />
						</Private>
				</LNode>
				<DataTypeTemplates>
						<LNodeType id="PIOC_V001" lnClass="PIOC">
								<DO name="Op" type="ACT_V001" transient="false" />
								<DO name="Str" type="ACD_V003" transient="false" />
						</LNodeType>
						<DOType id="ACT_V001" cdc="ACT">
								<DA desc="general" bType="BOOLEAN" name="general" dchg="false" dupd="false" fc="ST"
										qchg="false" />
								<DA desc="quality" bType="Quality" name="q" dchg="false" dupd="false" fc="ST"
										qchg="false" />
								<DA desc="time" bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST"
										qchg="false" />
						</DOType>
						<LNodeType id="PTRC_TR_SET_V002" lnClass="PTRC">
								<DO desc="Trip (electrical protection function)" name="Tr" type="ACT_V001"
										transient="false" />
								<DO desc="Behaviour" name="Beh" type="ENS_BehaviourModeKind" transient="false" />
						</LNodeType>
						<DOType id="ACD_V003" cdc="ACD">
								<DA bType="BOOLEAN" name="phsA" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="BOOLEAN" name="phsB" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="BOOLEAN" name="phsC" dchg="false" dupd="false" fc="ST" qchg="false" />
						</DOType>
						<DOType id="ENS_BehaviourModeKind" cdc="ENS">
								<DA bType="Enum" name="stVal" type="BehaviourModeKind" dchg="false" dupd="false"
										fc="ST" qchg="false" />
								<DA bType="Quality" name="q" dchg="false" dupd="false" fc="ST" qchg="false" />
								<DA bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST" qchg="false" />
						</DOType>
				</DataTypeTemplates>
				<LNode iedName="P1" ldInst="P51" lnClass="PTRC" lnInst="1" lnType="PTRC_TR_SET_V002"
						prefix="" uuid="9c00571a-133d-4eba-a71a-6a0380ac6169"
						templateUUID="123e4567-e89b-12d3-a456-789012345678">
						<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:LNodeInputs>
										<eIEC61850-6-100:SourceRef pDO="Op" pLN="PIOC" pDA="general" input="Op" inputInst="1"
												service="Report" sourceLNodeUuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
												sourceDoName="Op" sourceDaName="general" uuid="0-0-0-0-0" />
										<eIEC61850-6-100:SourceRef pDO="Op" pLN="PIOC" pDA="q" input="Op" inputInst="1"
												service="Report" sourceLNodeUuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
												sourceDoName="Op" sourceDaName="q" uuid="2-0-0-0-0" />
										<eIEC61850-6-100:SourceRef pDO="Op" pLN="PIOC" pDA="t" input="Op" inputInst="1"
												service="Report" sourceLNodeUuid="0033a7f6-8d64-449f-9def-a5103fbb06e8"
												sourceDoName="Op" sourceDaName="t" uuid="4-0-0-0-0" />
								</eIEC61850-6-100:LNodeInputs>
						</Private>
				</LNode>
			</SCL>
`

		const expectedXml = new DOMParser().parseFromString(expected, 'text/xml')
		const expectedXmlAsString = new XMLSerializer()
			.serializeToString(expectedXml)
			.replace(/>\s+</g, '>\n<')
			.trim()

		expect(xmlAsString, 'generatedXML: \n' + xmlAsString).toEqual(expectedXmlAsString)
	})
})

async function loadMinimalTestDB() {
	const sclFile = new File([sclData], 'test.ssd', { type: 'text/xml' })
	const [fileName] = await importXmlFiles({ files: [sclFile] })
	localStorage.setItem('currentActiveFileDatabaseName', fileName)

	const db = new Dexie(fileName)
	db.version(1).stores({
		DOS: 'id',
		LNodeInputs: 'id',
		SourceRef: 'id',
		DA: 'id',
		DO: 'id',
		DAS: 'id',
		SubscriberLNode: 'id',
		DOType: 'id',
		DataTypeTemplates: 'id',
		LNode: 'id',
		LNodeType: 'id',
		Private: 'id',
	})
	await db.open()
	return db
}

function createMockRandomUUID(): () => `${string}-${string}-${string}-${string}-${string}` {
	let counter = 0
	return function () {
		return `${counter++}-0-0-0-0`
	}
}
