import type Dexie from 'dexie'
import type { DatabaseRecord, Namespace } from '@septkit/fileio'
import type { PartialBy } from './types'
import { extractAttr, useSDK, type SDK } from './sdk'
import { openDatabase } from './database'
import type { DataflowType } from '@/lnode/connection'
import type { LNode } from '@/lnode/lnode'

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

export function useDataflow() {
	return {
		create,
	}

	async function create(
		formValues: ValidatedDataflowCreationForm,
		sourceLNode: LNode,
		destinationLNode: LNode,
	) {
		const activeFile = localStorage.getItem('currentActiveFileDatabaseName')
		if (!activeFile) {
			throw new Error('no active file')
		}

		const db = await openDatabase(activeFile)
		const sdk = useSDK(db)

		const lNodeInputsElement = await getLNodeInputsElement(db, sdk, destinationLNode)
		await addSourceRefElements(sdk, sourceLNode, lNodeInputsElement, formValues)

		db.close()
	}
}

async function getLNodeInputsElement(db: Dexie, sdk: SDK, destinationLNode: LNode) {
	const lNodeRecord = await db.table<DatabaseRecord>('LNode').get({ id: destinationLNode.id })

	if (!lNodeRecord || !lNodeRecord.children || lNodeRecord.children.length == 0) {
		const err = {
			msg: `LNode element with uuid ${destinationLNode.uuid} not found or empty`,
		}
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	const privateRecords = await sdk.findChildRecordsByTagName(lNodeRecord, 'Private')
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

	const lNodeInputsRecords = await sdk.findChildRecordsByTagName(privateRecords[0], 'LNodeInputs')

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
	sdk: SDK,
	sourceLNode: LNode,
	lNodeInputsRecord: DatabaseRecord,
	dataflowCreationFormFields: ValidatedDataflowCreationForm,
) {
	const addedSourceRef = await addSourceRefElement(
		sdk,
		dataflowCreationFormFields,
		sourceLNode,
		lNodeInputsRecord.namespace,
	)
	await sdk.ensureRelationship(lNodeInputsRecord, addedSourceRef)

	if (dataflowCreationFormFields.includeQuality) {
		let formFieldsForQuality = structuredClone(dataflowCreationFormFields)
		formFieldsForQuality.attribute = 'q' // Set to 'q' for Quality
		const addedQualitySourceRef = await addSourceRefElement(
			sdk,
			formFieldsForQuality,
			sourceLNode,
			lNodeInputsRecord.namespace,
		)
		await sdk.ensureRelationship(lNodeInputsRecord, addedQualitySourceRef)
	}

	if (dataflowCreationFormFields.includeTimestamp) {
		let formFieldsForTimestamp = structuredClone(dataflowCreationFormFields)
		formFieldsForTimestamp.attribute = 't' // Set to 't' for Quality
		const addedTimeStampSourceRef = await addSourceRefElement(
			sdk,
			formFieldsForTimestamp,
			sourceLNode,
			lNodeInputsRecord.namespace,
		)
		await sdk.ensureRelationship(lNodeInputsRecord, addedTimeStampSourceRef)
	}
}

export async function addSourceRefElement(
	sdk: SDK,
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
				name: 'uuid',
				value: crypto.randomUUID(),
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
			// TODO: resourceName, source, templateUUID (?) attributes (https://github.com/SeptKit/set/issues/163)
		],
		parent: null,
		value: null,
		children: null,
	}

	return await sdk.addRecord(sourceRefToAdd)
}
