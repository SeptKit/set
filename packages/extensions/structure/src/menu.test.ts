import { describe, expect, it } from 'vitest'
import { instantiateFSD } from './menu'
import { importXmlFiles, exportFile } from '@septkit/fileio'
import Dexie from 'dexie'

describe('Menu: Instantiate Function', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
			asdContent: string
			fsdContent: string
			epxectedASD: string
		}

		const featureTests: TestCase[] = [
			{
				desc: 'All of the parents of the function exist',
				asdContent: `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
						</Substation>
					</SCL>
				`,
				fsdContent: `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="fn-1"></Function>
						</Substation>
					</SCL>
				`,
				epxectedASD: `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
							<Function name="Binary Output" uuid="6-0-0-0-0" templateUuid="fn-1" />
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'Missing parent elements (Voltage Level) are transfered',
				asdContent: `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
						</Substation>
					</SCL>
				`,
				fsdContent: `
					<SCL>
						<Substation name="TEMPLATE">
							<VoltageLevel name="TEMPLATE">
								<Function name="Binary Output" uuid="fn-1">
								</Function>
							</VoltageLevel>
						</Substation>
					</SCL>
				`,
				epxectedASD: `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
							<VoltageLevel name="TEMPLATE">
								<Function name="Binary Output" uuid="7-0-0-0-0" templateUuid="fn-1" />
							</VoltageLevel>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'The content of the function is transfered',
				asdContent: `
					<SCL>
					</SCL>
				`,
				fsdContent: `
					<SCL>
						<Substation name="TEMPLATE">
							<VoltageLevel name="TEMPLATE">
								<Function name="Binary Output" uuid="fn-1">
									<LNode iedName="none">
									</LNode>
								</Function>
							</VoltageLevel>
						</Substation>
					</SCL>
				`,
				epxectedASD: `
					<SCL>
						<Substation name="TEMPLATE">
							<VoltageLevel name="TEMPLATE">
								<Function name="Binary Output" uuid="6-0-0-0-0" templateUuid="fn-1" >
									<LNode iedName="none" />
								</Function>
							</VoltageLevel>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'DataTypeTemplates are trasfered',
				asdContent: `
					<SCL>
					</SCL>
				`,
				fsdContent: `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
							<DO desc="first-do" name="do-one" type="TEST"/>
							<EnumVal desc="A²" ord="69">A²</EnumVal>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
								<DO desc="first-do" name="do-one" type="TEST"/>
								<EnumVal desc="A²" ord="69">A²</EnumVal>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
			},
			{
				desc: 'new templates are added',
				asdContent: `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="TEST"/>
								<DO name="Beh" type="BehaviourModeKind"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
				fsdContent: `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
							<DO desc="first-do" name="do-one" type="TEST"/>
							<EnumVal desc="A²" ord="69">A²</EnumVal>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="TEST"/>
								<DO name="Beh" type="BehaviourModeKind"/>
							</LNodeType>
							<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
								<DO desc="first-do" name="do-one" type="TEST"/>
								<EnumVal desc="A²" ord="69">A²</EnumVal>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
			},
			{
				desc: 'Existing types are skipped',
				asdContent: `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="Existing Value"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
				fsdContent: `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="existing-lnode-type" lnClass="LLN0">
							<DO name="Mod" type="New Value"/>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="Existing Value"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Note: we mock the randomUUID in order to
				// be able to deine expected output in a deterministic way
				crypto.randomUUID = createMockRandomUUID()

				//
				// Arrange
				//
				await clearDB()
				const asdFile = new File([tc.asdContent], 'application.asd', { type: 'text/xml' })
				const fsdFile = new File([tc.fsdContent], 'function.fsd', { type: 'text/xml' })

				// Arrange: "Open" ASD File
				const asdFileNames = await importXmlFiles({ files: [asdFile] })
				expect(asdFileNames).toHaveLength(1)
				const asdFileName = asdFileNames[0]
				localStorage.setItem('currentActiveFileDatabaseName', asdFileName)

				// Arrange: Import FSDs
				const fsdFileNames = await importXmlFiles({ files: [fsdFile] })
				expect(fsdFileNames).toHaveLength(1)
				const fsdFileName = fsdFileNames[0]

				//
				// Act
				//
				// Note: This is needed because the import resolvs too early
				await instantiateFSD(asdFileName, [fsdFileName])

				//
				// Assert
				//
				const { xmlDocument } = await exportFile({ databaseName: asdFileName })
				const xmlAsString = new XMLSerializer()
					.serializeToString(xmlDocument)
					.replace(/></g, '>\n<')

				const expectedASDXml = new DOMParser().parseFromString(tc.epxectedASD, 'text/xml')
				const expectedASDAsString = new XMLSerializer()
					.serializeToString(expectedASDXml)
					.replace(/>\s+</g, '>\n<')
					.trim()
				expect(xmlAsString).toEqual(expectedASDAsString)
			})
		}
	})
})

async function clearDB() {
	const databases = await indexedDB.databases()
	const promises = databases.map((db) => {
		if (!db.name) return Promise.resolve()

		return Dexie.delete(db.name)
	})

	return Promise.all(promises)
}

function createMockRandomUUID(): () => `${string}-${string}-${string}-${string}-${string}` {
	let counter = 0
	return function () {
		return `${counter++}-0-0-0-0`
	}
}
