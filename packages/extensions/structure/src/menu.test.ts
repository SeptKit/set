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
				asdContent: /*xml*/ `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="fn-1"></Function>
						</Substation>
					</SCL>
				`,
				epxectedASD: /*xml*/ `
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
				asdContent: /*xml*/ `
					<SCL>
						<Substation name="TEMPLATE">
							<Function name="already existed" uuid="already-existed" />
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
					<SCL>
						<Substation name="TEMPLATE">
							<VoltageLevel name="TEMPLATE">
								<Function name="Binary Output" uuid="fn-1">
								</Function>
							</VoltageLevel>
						</Substation>
					</SCL>
				`,
				epxectedASD: /*xml*/ `
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
				asdContent: /*xml*/ `
					<SCL>
					</SCL>
				`,
				fsdContent: /*xml*/ `
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
				epxectedASD: /*xml*/ `
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
				asdContent: /*xml*/ `
					<SCL>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
							<DO desc="first-do" name="do-one" type="TEST"/>
							<EnumVal desc="A²" ord="69">A²</EnumVal>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
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
				asdContent: /*xml*/ `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="TEST"/>
								<DO name="Beh" type="BehaviourModeKind"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="tctr_7_4_B2007" lnClass="TCTR">
							<DO desc="first-do" name="do-one" type="TEST"/>
							<EnumVal desc="A²" ord="69">A²</EnumVal>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
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
				asdContent: /*xml*/ `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="Existing Value"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL>
					<DataTypeTemplates>
						<LNodeType id="existing-lnode-type" lnClass="LLN0">
							<DO name="Mod" type="New Value"/>
						</LNodeType>
					</DataTypeTemplates>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL>
						<DataTypeTemplates>
							<LNodeType id="existing-lnode-type" lnClass="LLN0">
								<DO name="Mod" type="Existing Value"/>
							</LNodeType>
						</DataTypeTemplates>
					</SCL>
				`,
			},
			{
				desc: 'FunctionCategory elements are instantiated',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Private type="eIEC61850-6-100">
							<Function name="Binary Output" uuid="a-new-function" />
							<eIEC61850-6-100:FunctionCategory name="new function category" uuid="new-function-category">
								<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="8-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="new function category" uuid="10-0-0-0-0" templateUuid="new-function-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="8-0-0-0-0"/>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'FunctionCategory and SubCategory elements are instantiated',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Private type="eIEC61850-6-100">
							<Function name="Binary Output" uuid="a-new-function" />
							<eIEC61850-6-100:FunctionCategory name="new function category" uuid="new-function-category">
								<eIEC61850-6-100:SubCategory name="new function subcategory" uuid="new-function-sub-category">
									<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
								</eIEC61850-6-100:SubCategory>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="9-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="new function category" uuid="11-0-0-0-0" templateUuid="new-function-category">
									<eIEC61850-6-100:SubCategory name="new function subcategory" uuid="13-0-0-0-0" templateUuid="new-function-sub-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="9-0-0-0-0"/>
									</eIEC61850-6-100:SubCategory>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'Mixed SubCategory and FunctionCateRef elements as children of FunctionCategory element',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Function name="Binary Output" uuid="a-new-function" />
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionCategory name="new function category" uuid="new-function-category">
								<eIEC61850-6-100:SubCategory name="new function subcategory" uuid="new-function-sub-category">
									<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
								</eIEC61850-6-100:SubCategory>
								<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="10-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="new function category" uuid="12-0-0-0-0" templateUuid="new-function-category">
									<eIEC61850-6-100:SubCategory name="new function subcategory" uuid="15-0-0-0-0" templateUuid="new-function-sub-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="10-0-0-0-0"/>
									</eIEC61850-6-100:SubCategory>
									<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="10-0-0-0-0"/>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'Multiple levels of SubCategory elements are instantiated',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Function name="Binary Output" uuid="a-new-function" />
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionCategory name="Main Function Category" uuid="main-function-category">
								<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="sub-category-level-1">
									<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="sub-category-level-2">
										<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="sub-category-level-3">
											<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
										</eIEC61850-6-100:SubCategory>
									</eIEC61850-6-100:SubCategory>
								</eIEC61850-6-100:SubCategory>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="11-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="Main Function Category" uuid="13-0-0-0-0" templateUuid="main-function-category">
									<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="15-0-0-0-0" templateUuid="sub-category-level-1">
										<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="17-0-0-0-0" templateUuid="sub-category-level-2">
											<eIEC61850-6-100:SubCategory name="Sub Category Level 1" uuid="19-0-0-0-0" templateUuid="sub-category-level-3">
												<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="11-0-0-0-0"/>
											</eIEC61850-6-100:SubCategory>
										</eIEC61850-6-100:SubCategory>
									</eIEC61850-6-100:SubCategory>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'Merge the content of categories',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Existing Function" uuid="an-existing-function" templateUuid="irrelevant-for-the-test-case" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="Existing Funtion Category" uuid="81ff2b17-5701-486a-a974-74c28389810a" templateUuid="existing-function-category">
									<eIEC61850-6-100:SubCategory name="Existing Sub Category" uuid="5bafbac9-7603-452b-accd-24cf1d1e295d" templateUuid="existing-sub-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Existing Function" functionUuid="an-existing-function"/>
									</eIEC61850-6-100:SubCategory>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Function name="Binary Output" uuid="a-new-function" />
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionCategory name="Existing Funtion Category" uuid="existing-function-category">
								<eIEC61850-6-100:SubCategory name="A new Sub Category" uuid="a-new-sub-category">
									<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
								</eIEC61850-6-100:SubCategory>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Existing Function" uuid="an-existing-function" templateUuid="irrelevant-for-the-test-case" />
							<Function name="Binary Output" uuid="14-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="Existing Funtion Category" uuid="81ff2b17-5701-486a-a974-74c28389810a" templateUuid="existing-function-category">
									<eIEC61850-6-100:SubCategory name="Existing Sub Category" uuid="5bafbac9-7603-452b-accd-24cf1d1e295d" templateUuid="existing-sub-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Existing Function" functionUuid="an-existing-function"/>
									</eIEC61850-6-100:SubCategory>
									<eIEC61850-6-100:SubCategory name="A new Sub Category" uuid="16-0-0-0-0" templateUuid="a-new-sub-category">
										<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="14-0-0-0-0"/>
									</eIEC61850-6-100:SubCategory>
								</eIEC61850-6-100:FunctionCategory>
							</Private>
						</Substation>
					</SCL>
				`,
			},
			{
				desc: 'Update the functionUuid to the new instantiated function uuid',
				asdContent: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
						</Substation>
					</SCL>
				`,
				fsdContent: /*xml*/ `
				<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
					<Substation name="TEMPLATE">
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionCategory name="Main Function Category" uuid="main-function-category">
								<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="a-new-function"/>
							</eIEC61850-6-100:FunctionCategory>
						</Private>
						<Function name="Binary Output" uuid="a-new-function" />
					</Substation>
				</SCL>
				`,
				epxectedASD: /*xml*/ `
					<SCL xmlns:eIEC61850-6-100="http://www.iec.ch/61850/2019/SCL/6-100">
						<Substation name="TEMPLATE">
							<Function name="Binary Output" uuid="8-0-0-0-0" templateUuid="a-new-function" />
							<Private type="eIEC61850-6-100">
								<eIEC61850-6-100:FunctionCategory name="Main Function Category" uuid="10-0-0-0-0" templateUuid="main-function-category">
									<eIEC61850-6-100:FunctionCatRef function="TEMPLATE/Binary Output" functionUuid="8-0-0-0-0"/>
								</eIEC61850-6-100:FunctionCategory>
							</Private>

						</Substation>
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
