import type Dexie from 'dexie'
import type { DatabaseRecord, Namespace } from '@septkit/fileio'
import type { PartialBy } from '@/types/types.ts'
import type { DataflowType } from '@/types/connection'
import { useSDK, type SDK } from './sdk.ts'
import type { LNode } from './types/lnode.ts'
import { openDatabase } from './assets/open-db.ts'

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

	// TODO: Do we have to create a Private element if it does not exist?
	if (privateRecords.length != 1) {
		const err = {
			msg: `Private element not found or more than one element found in LNode with uuid ${destinationLNode.uuid}`,
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
		dataflowCreationFormFields.attribute = 'q' // Set to 'q' for Quality
		const addedQualitySourceRef = await addSourceRefElement(
			sdk,
			dataflowCreationFormFields,
			sourceLNode,
			lNodeInputsRecord.namespace,
		)
		await sdk.ensureRelationship(lNodeInputsRecord, addedQualitySourceRef)
	}

	if (dataflowCreationFormFields.includeTimestamp) {
		dataflowCreationFormFields.attribute = 't' // Set to 't' for Quality
		const addedTimeStampSourceRef = await addSourceRefElement(
			sdk,
			dataflowCreationFormFields,
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
