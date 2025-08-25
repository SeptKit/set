import type Dexie from 'dexie'
import type { DatabaseRecord, Namespace } from '@septkit/fileio'
import type { PartialBy } from '@/x/types'
import { extractAttr, useDatabase, type DatabaseSDK } from '@/x/use-database'
import type { DataflowType } from './connection'
import type { LNode } from './lnode'
import { toRaw } from 'vue'

export type DataflowCreationForm = {
	type: DataflowType | null
	signal: string
	attribute: string
	inputName: string
	inputInstance: string
	includeQuality: boolean
	includeTimestamp: boolean
}

export type ValidatedDataflowCreationForm = Omit<DataflowCreationForm, 'type'> & {
	type: NonNullable<DataflowCreationForm['type']>
}

export function useDataflow(db: Dexie) {
	const databaseSdk = useDatabase(db)

	return {
		create,
	}

	async function create(
		formValues: ValidatedDataflowCreationForm,
		sourceLNode: LNode,
		destinationLNode: LNode,
	) {
		const lNodeInputsElement = await getLNodeInputsElement(db, databaseSdk, destinationLNode)
		await addSourceRefElements(databaseSdk, sourceLNode, lNodeInputsElement, formValues)
	}
}

async function getLNodeInputsElement(db: Dexie, databaseSdk: DatabaseSDK, destinationLNode: LNode) {
	const lNodeRecord = await db.table<DatabaseRecord>('LNode').get({ id: destinationLNode.id })

	if (!lNodeRecord || !lNodeRecord.children || lNodeRecord.children.length == 0) {
		const err = {
			msg: `LNode element with uuid ${destinationLNode.uuid} not found or empty`,
		}
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	const privateRecords = await databaseSdk.findChildRecordsByTagName(lNodeRecord, 'Private')
	let private6_100 = privateRecords
		.filter((el) => extractAttr(el, 'type')?.value === 'eIEC61850-6-100')
		.at(0)

	// TODO: Do we have to create a Private element if it does not exist or does LNodeInputs have to be inside a Private element?
	if (!private6_100) {
		const err = {
			msg: `Private element of type 'eIEC61850-6-100' not found in LNode with uuid ${destinationLNode.uuid}`,
		}
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	const lNodeInputsRecords = await databaseSdk.findChildRecordsByTagName(
		privateRecords[0],
		'LNodeInputs',
	)

	// TODO: Do we have to create a LNodeInputs element if it does not exist?
	if (lNodeInputsRecords.length != 1) {
		const err = {
			msg: `LNodeInputs element not found or more than one element found in LNode with uuid ${destinationLNode.uuid}`,
		}
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	return lNodeInputsRecords[0]
}

async function addSourceRefElements(
	databaseSdk: DatabaseSDK,
	sourceLNode: LNode,
	lNodeInputsRecord: DatabaseRecord,
	dataflowCreationFormFields: ValidatedDataflowCreationForm,
) {
	const addedSourceRef = await addSourceRefElement(
		databaseSdk,
		dataflowCreationFormFields,
		sourceLNode,
		lNodeInputsRecord.namespace,
	)
	await databaseSdk.ensureRelationship(lNodeInputsRecord, addedSourceRef)

	if (dataflowCreationFormFields.includeQuality) {
		let formFieldsForQuality = structuredClone(toRaw(dataflowCreationFormFields))
		formFieldsForQuality.attribute = 'q' // Set to 'q' for Quality
		const addedQualitySourceRef = await addSourceRefElement(
			databaseSdk,
			formFieldsForQuality,
			sourceLNode,
			lNodeInputsRecord.namespace,
		)
		await databaseSdk.ensureRelationship(lNodeInputsRecord, addedQualitySourceRef)
	}

	if (dataflowCreationFormFields.includeTimestamp) {
		let formFieldsForTimestamp = structuredClone(toRaw(dataflowCreationFormFields))
		formFieldsForTimestamp.attribute = 't' // Set to 't' for Quality
		const addedTimeStampSourceRef = await addSourceRefElement(
			databaseSdk,
			formFieldsForTimestamp,
			sourceLNode,
			lNodeInputsRecord.namespace,
		)
		await databaseSdk.ensureRelationship(lNodeInputsRecord, addedTimeStampSourceRef)
	}
}

export async function addSourceRefElement(
	databaseSdk: DatabaseSDK,
	dataflowCreationFormFields: ValidatedDataflowCreationForm,
	sourceLNode: LNode,
	namespace: Namespace | null,
) {
	const sourceRefToAdd: PartialBy<DatabaseRecord, 'id'> = {
		tagName: 'SourceRef',
		namespace: namespace,
		attributes: [
			{
				name: 'pDO',
				value: dataflowCreationFormFields.signal,
			},
			{
				name: 'pLN',
				value: sourceLNode.lnClass,
			},
			{
				name: 'pDA',
				value: dataflowCreationFormFields.attribute,
			},
			{
				name: 'input',
				value: dataflowCreationFormFields.inputName,
			},
			{
				name: 'inputInst',
				value: dataflowCreationFormFields.inputInstance,
			},
			{
				name: 'service',
				value: dataflowCreationFormFields.type,
			},
			{
				name: 'sourceLNodeUuid',
				value: sourceLNode.uuid,
			},
			{
				name: 'sourceDoName',
				value: dataflowCreationFormFields.signal,
			},
			{
				name: 'sourceDaName',
				value: dataflowCreationFormFields.attribute, // TODO: in the example SSD this was a combination fo SDS and DA name
			},

			{
				name: 'uuid',
				value: crypto.randomUUID(),
			},
			// TODO: resourceName, source, templateUUID (?) attributes (https://github.com/SeptKit/set/issues/163)
		],
		parent: null,
		value: null,
		children: null,
	}

	return await databaseSdk.addRecord(sourceRefToAdd)
}
