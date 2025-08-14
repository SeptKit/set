import type { DataAttribute, DataObject, LNode } from '@/types/lnode'
import type { DatabaseRecord } from '../../node_modules/@septkit/fileio/dist/common/common.types'
import Dexie from 'dexie'
import { useStorage } from '@vueuse/core'
import { openDatabase } from './open-db'

//Main function to get enriched LNodes from the database
export async function getEnrichedLNodesFromDB(): Promise<LNode[]> {
	const currentActiveFileDatabaseName = useStorage<string>(
		'currentActiveFileDatabaseName',
		'',
		localStorage,
	)
	if (!currentActiveFileDatabaseName.value) throw new Error('No active file database name set.')
	const db = await openDatabase(currentActiveFileDatabaseName.value)
	if (!db) throw new Error('database is not initialized.')
	const lnodes = await getAllLNodes(db)
	if (!lnodes.length) return []
	const lnodesWithDOs = await enrichLNodesWithDataObjects(db, lnodes)
	const lnodesFullyEnriched = await enrichLNodesWithDataAttributes(db, lnodesWithDOs)

	db.close()

	return lnodesFullyEnriched
}

// Get all LNode records from the database
async function getAllLNodes(db: Dexie): Promise<LNode[]> {
	const lnodeRecords = await db.table<DatabaseRecord>('LNode').toArray()
	return lnodeRecords.map((record) => ({
		id: record.id,
		uuid: getAttribute(record, 'uuid') ?? '',
		iedName: getAttribute(record, 'iedName') ?? '',
		prefix: getAttribute(record, 'prefix') ?? '',
		lnClass: getAttribute(record, 'lnClass') ?? '',
		lnInst: getAttribute(record, 'lnInst') ?? '',
		lnType: getAttribute(record, 'lnType'),
		dataObjects: [],
	}))
}

// Get the DataObjects for each LNode
async function enrichLNodesWithDataObjects(db: Dexie, lnodes: LNode[]): Promise<LNode[]> {
	const allLNodeTypes = await db.table<DatabaseRecord>('LNodeType').toArray()
	return Promise.all(
		lnodes.map(async (lnode) => {
			if (!lnode.lnType) return { ...lnode, dataObjects: [] }

			const lnodeType = allLNodeTypes.find((rec) =>
				rec.attributes?.find((attr) => attr.name === 'id' && attr.value === lnode.lnType),
			)
			const dataObjects: DataObject[] = []
			if (lnodeType?.children) {
				for (const childRef of lnodeType.children) {
					if (childRef.tagName !== 'DO') continue
					const doRecord = await db.table<DatabaseRecord>('DO').get(childRef.id)
					if (!doRecord) continue
					dataObjects.push({
						id: doRecord.id,
						uuid: getAttribute(doRecord, 'uuid') ?? '',
						name: doRecord.attributes?.find((a) => a.name === 'name')?.value ?? doRecord.id,
						lNodeId: lnode.id,
						dataAttributes: [],
					})
				}
			}
			return { ...lnode, dataObjects }
		}),
	)
}

//Get the DataAttributes for each DataObject in each LNode
async function enrichLNodesWithDataAttributes(db: Dexie, lnodes: LNode[]): Promise<LNode[]> {
	const allDOTypes = await db.table<DatabaseRecord>('DOType').toArray()
	const allDARecords = await db.table<DatabaseRecord>('DA').toArray()

	return Promise.all(
		lnodes.map(async (lnode) => {
			const enrichedDataObjects = await Promise.all(
				(lnode.dataObjects ?? []).map(async (dataObject) => {
					const doTypeId = dataObject
						? getAttribute(await db.table<DatabaseRecord>('DO').get(dataObject.id)!, 'type')
						: undefined
					if (!doTypeId) return { ...dataObject, dataAttributes: [] }

					const doType = allDOTypes.find((rec) =>
						rec.attributes?.find((a) => a.name === 'id' && a.value === doTypeId),
					)
					if (!doType || !doType.children) return { ...dataObject, dataAttributes: [] }

					const dataAttributes: DataAttribute[] = []
					for (const childRef of doType.children) {
						if (childRef.tagName !== 'DA') continue
						const daRecord = allDARecords.find((d) => d.id === childRef.id)
						if (!daRecord) continue
						const daName = getAttribute(daRecord, 'name') ?? daRecord.id
						const daFc = getAttribute(daRecord, 'fc') ?? ''
						dataAttributes.push({
							id: daRecord.id,
							uuid: getAttribute(daRecord, 'uuid') ?? '',
							name: daName,
							dataObjectId: dataObject.id,
							fc: daFc,
						})
					}
					return { ...dataObject, dataAttributes }
				}),
			)
			return { ...lnode, dataObjects: enrichedDataObjects }
		}),
	)
}

// Helper function to get an attribute value from a record
function getAttribute(record: DatabaseRecord | undefined, name: string): string | undefined {
	return record?.attributes?.find((a) => a.name === name)?.value
}

/**

 * Example LNode

              <LNode iedName="P1" ldInst="CB" lnClass="XCBR" lnInst="1" lnType="ELIA_XCBR" prefix="" uuid="e775a78e-2879-40c7-adbf-fa6acc7a802f" templateUUID="123e4567-e89b-12d3-a456-789012345678">
                <Private type="eIEC61850-6-100">
                  <eIEC61850-6-100:LNodeSpecNaming sIedName="P1" sLdInst="CB" sLnClass="XCBR" sLnInst="1" sPrefix=""/>
                  <eIEC61850-6-100:DOS desc="" name="TrCmd">
									-->
											type DataObject = {
												id: string // DA ID // Database ID?
												name: string // name attribute of the data attribute element // e.g., "TrCmd"
												dataAttributes: DataAttribute[] // list of data attributes // e.g., "stVal", "q"
												lNodeId: string // ID of the LNode this data object belongs to // Database ID of the LNode?
											}

                    <eIEC61850-6-100:DAS desc="TrCmd.stVal[ST]" name="stVal"/>
										 -->
										 		type DataAttribute = {
 													id: string // DA ID // Database ID?
 													name: string // name attribute of the data attribute element // e.g., "stVal"
 													dataObjectId: string // ID of the DataObject this data attribute belongs to // Database ID of the DataObject?
 													fc: string // I need this to later filter the DO options in the creation dialog // ??
												}
                    <eIEC61850-6-100:DAS desc="TrCmd.q[ST]" name="q"/>
										 -->
										 		type DataAttribute = {
 													id: string // DA ID // Database ID?
 													name: string // name attribute of the data attribute element // e.g., "q"
 													dataObjectId: string // ID of the DataObject this data attribute belongs to // Database ID of the DataObject?
 													fc: string // I need this to later filter the DO options in the creation dialog // ??
												}
                  </eIEC61850-6-100:DOS>
                  <eIEC61850-6-100:LNodeInputs>
                    <eIEC61850-6-100:SourceRef pDO="Tr" pLN="PTRC" pDA="general" input="Trip" service="Internal" source="TEMPLATE/TEMPLATE/TEMPLATE/P51 Function/Trip/PTRC1.Tr.general" sourceLNodeUuid="9c00571a-133d-4eba-a71a-6a0380ac6169" sourceDoName="Tr" sourceDaName="general" uuid="SRCREF1" templateUUID="123e4567-e89b-12d3-a456-789012345678"/>
                  </eIEC61850-6-100:LNodeInputs>
                </Private>
              </LNode>

	Here we need to get
	-the children? (DOS, DAS, LNodeInputs, ...more?)
	 		-> LNodeInputs for right LNode
	-the SourceRef (Receiver alsways has a SourceRef) important attributes: "source", "service",
	-the lnType (e.g., ELIA_XCBR)

	    <LNodeType id="ELIA_XCBR" lnClass="XCBR">
      <DO name="Beh" type="ELIA_ENS_BehaviourModeKind" transient="false"/>
			   -> type nehmen,
				     <DOType id="ELIA_ENS_BehaviourModeKind" cdc="ENS">
							<DA bType="Enum" name="stVal" type="ELIA_BehaviourModeKind" dchg="false" dupd="false" fc="ST" qchg="false"/>
							<DA bType="Quality" name="q" dchg="false" dupd="false" fc="ST" qchg="false"/>
							<DA bType="Timestamp" name="t" dchg="false" dupd="false" fc="ST" qchg="false"/>
						</DOType>
      <DO name="OpCmd" type="ELIA_SPS_basic_V001" transient="false"/>
      <DO name="OpCnt" type="ELIA_INS" transient="false"/>
      <DO name="BlkOpn" type="ELIA_SPC" transient="false"/>
      <DO name="BlkCls" type="ELIA_SPC" transient="false"/>
      <DO name="Pos" type="ELIA_DPC" transient="false"/>
      <DO name="ClsCmd" type="ELIA_SPS_basic_V001" transient="false"/>
      <DO name="Loc" type="ELIA_SPS_basic_V001" transient="false"/>
      <DO name="EEName" type="ELIA_DPL_V003" transient="false"/>
      <DO name="NamUr" type="ELIA_VSD" transient="false"/>
      <DO name="NamIr" type="ELIA_VSD" transient="false"/>
      <DO name="NamIsc" type="ELIA_VSD" transient="false"/>
      <DO name="NamXpo" type="ELIA_VSD" transient="false"/>
      <DO name="NamXis" type="ELIA_VSD" transient="false"/>
      <DO name="TrCmd" type="ELIA_SPS_basic_V001" transient="false"/>
    </LNodeType>


	Possible Types:

	// used to render the LNodes in the UI and pass onto creation dialog
	type LNode = {
 		id: string
 		name: string
		lnType: string // e.g., "ELIA_XCBR"
 		dataObjects: DataObject[]
	}

	type DataObject = {
 		id: string // DA ID
 		name: string // name attribute of the data attribute element
 		dataAttributes: DataAttribute[] // list of data attributes
 		lNodeId: string // ID of the LNode this data object belongs to
	}

	type DataAttribute = {
 		id: string // DA ID
 		name: string // name attribute of the data attribute element
 		dataObjectId: string // ID of the DataObject this data attribute belongs to
 		fc: string // I need this to later filter the DO options in the creation dialog
	}

// used to render the connections in the UI
	type Connection = {
		id: string //
 		sourceLNodeId: string
 		sourceAttributeId: string
 		destinationLNodeId: string
 		dataflowType: 'goose' | 'smv' | 'reporting' | 'internal' | 'wired' | 'control'
 		inputInstance: string
 		inputName: string
	}

 */
