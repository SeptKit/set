import { useFileDialog } from '@vueuse/core'
import { importXmlFiles } from '@septkit/fileio'
// TODO: only this seems to work
import type { DatabaseRecord } from '../node_modules/@septkit/fileio/dist/common/common.types'
import Dexie from 'dexie'
import { extractAttr, findRecordByAttribute, useSDK } from './sdk'

export default async function menuActionFn() {
	const activeFile = localStorage.getItem('currentActiveFileDatabaseName')
	if (!activeFile) {
		throw new Error('no active file')
	}

	const fsdFiles = await promptForFSDSelection()
	const importedFiles = await importXmlFiles({ files: fsdFiles })
	await instantiateFSD(activeFile, importedFiles)
}

export async function instantiateFSD(asdName: string, fsdFileNames: string[]) {
	//
	// Open Files
	//
	const asdDB = new Dexie(asdName)
	await asdDB.open()
	const asdSDK = useSDK(asdDB)

	const fsdDB = new Dexie(fsdFileNames[0])
	await fsdDB.open()
	const fsdSDK = useSDK(fsdDB)

	await instantiateFunctions()
	await transferDataTypeTemplates()

	// TODO: changes: UUID->TemplateUUID; UUI->New, Path->Recalculate, Add fsdReference
	// TODO: Move + Merge Function Category
	fsdDB.close()
	asdDB.close()

	async function instantiateFunctions() {
		const functionsToInstantiate = await fsdDB.table<DatabaseRecord>('Function').toArray()

		for (const func of functionsToInstantiate) {
			const path = await extractElementPathTilSCLRoot(fsdDB, func)

			//
			// Ensure Parents exists in ASD
			//
			const newParentPath: DatabaseRecord[] = []
			// Note: could run parallel
			// Making sure every element exists in the other file
			for (const record of path) {
				if (isOf(record, ['Substation', 'VoltageLevel', 'Bay'])) {
					const newParent = await ensureRecordByAttribute(asdDB, record, 'name')
					newParentPath.push(newParent)
				}
			}

			//
			// Instantiate and add Function to ASD
			//
			fsdSDK.templateify(func)
			const funcInASD = await asdSDK.addRecord(func)

			//
			// Transfer children
			//
			const childrenInFSD = await fsdSDK.findChildRecrods(func)
			for (const childInFSD of childrenInFSD) {
				const childInASD = await transferFromFSDToASDWithChildrenRecursively(childInFSD)
				asdSDK.ensureRelationship(funcInASD, childInASD)
			}

			//
			// Setup relationships in the full path
			//
			const fullPath = [funcInASD, ...newParentPath]
			for (let i = 0; i < fullPath.length; i++) {
				const child = fullPath[i]
				const parent = fullPath[i + 1]
				if (parent) {
					await asdSDK.ensureRelationship(parent, child)
				}
			}

			//
			// Connect tha last parent to the SCL Root
			//
			const rootSCL = await asdSDK.findRootSCL()
			const lastItem = fullPath.at(-1)
			if (rootSCL && lastItem) {
				await asdSDK.ensureRelationship(rootSCL, lastItem)
			}
		}
	}

	async function transferDataTypeTemplates() {
		// Note: there should be only one `DataTypeTemplates` element
		const dataTypeTemplatesRecord = await fsdDB
			.table<DatabaseRecord>('DataTypeTemplates')
			.orderBy('id')
			.first()

		if (!dataTypeTemplatesRecord) {
			console.log('no data type templates, stopping')
			return
		}

		//
		// Ensure ASD has DataTypeTemplates
		//
		let dttInASD = await asdDB.table<DatabaseRecord>('DataTypeTemplates').orderBy('id').first()
		if (!dttInASD) {
			const newDTTRec: Omit<DatabaseRecord, 'id'> = {
				tagName: 'DataTypeTemplates',
				namespace: null,
				attributes: null,
				value: null,
				parent: null,
				children: null,
			}
			dttInASD = await asdSDK.addRecord(newDTTRec)
			const sclRoot = await asdSDK.findRootSCL()
			await asdSDK.ensureRelationship(sclRoot, dttInASD)
		}

		const templatesInFSD = await fsdSDK.findChildRecrods(dataTypeTemplatesRecord)
		if (templatesInFSD.length === 0) {
			console.log('DataTypeTemplates is empty, stopping.')
			return
		}

		for (const templateInFSD of templatesInFSD) {
			const idAttr = extractAttr(templateInFSD, 'id')
			if (!idAttr) {
				console.warn('id attribute not found, continuing', templateInFSD)
				continue
			}

			// Note: we are skipping existing templates/types
			const templateExistInASD = await asdSDK.findOneRecordByAttribute(
				templateInFSD.tagName,
				idAttr,
			)
			if (templateExistInASD) {
				continue
			}

			const templateInASD = await transferFromFSDToASDWithChildrenRecursively(templateInFSD)
			await asdSDK.ensureRelationship(dttInASD, templateInASD)
		}
	}

	async function transferFromFSDToASDWithChildrenRecursively(
		recordInFSD: DatabaseRecord,
	): Promise<DatabaseRecord> {
		const recordInASD = await asdSDK.addRecord(recordInFSD)
		const childrenInFSD = await fsdSDK.findChildRecrods(recordInFSD)
		for (const childInFSD of childrenInFSD) {
			const childInASD = await transferFromFSDToASDWithChildrenRecursively(childInFSD)
			asdSDK.ensureRelationship(recordInASD, childInASD)
		}

		return recordInASD
	}
}

async function ensureRecordByAttribute(
	targetDB: Dexie,
	record: DatabaseRecord,
	attributeName: string,
): Promise<DatabaseRecord> {
	const attr = extractAttr(record, attributeName)
	if (!attr) {
		console.error('could not find name of record', record)
		throw new Error('could not find name of record')
	}

	const element = await findRecordByAttribute(targetDB, record.tagName, attr)

	if (element) {
		return element
	}
	await targetDB.table(record.tagName).add(record)
	return record
}

function isOf(record: DatabaseRecord, tagNames: string[]) {
	return tagNames.includes(record.tagName)
}

async function findElement(
	db: Dexie,
	tagName: string,
	id: string,
): Promise<DatabaseRecord | undefined> {
	return db.table<DatabaseRecord>(tagName).get(id)
}

async function extractElementPathTilSCLRoot(
	db: Dexie,
	record: DatabaseRecord,
	path: DatabaseRecord[] = [],
): Promise<DatabaseRecord[]> {
	if (!record.parent) {
		return []
	}

	const parent = await findElement(db, record.parent.tagName, record.parent.id)
	if (!parent) {
		console.error('could not find parent for', record)
		throw new Error('could not find parent for record')
	}

	const isSCLRoot = !parent.parent
	if (isSCLRoot) {
		return []
	}

	const grandParentsPaths = await extractElementPathTilSCLRoot(db, parent, path)

	return [parent, ...grandParentsPaths]
}

async function promptForFSDSelection(): Promise<File[]> {
	const { promise, resolve } = Promise.withResolvers<File[]>()

	const { open, onChange } = useFileDialog({
		accept: 'fsd',
	})

	onChange((files: FileList | null) => {
		if (files?.length === 0 || files === null) {
			resolve([])
			return
		}

		resolve(Array.from(files))
	})

	open()
	return promise
}
