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

	//
	// Instansiate Functions
	//
	const functionToInstantiate = await fsdDB.table<DatabaseRecord>('Function').toArray()

	for (const func of functionToInstantiate) {
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
		const newFunc = await asdSDK.addRecord(func)

		//
		// Setup relationships in the full path
		//
		const fullPath = [newFunc, ...newParentPath]
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
		const rootSCL = await findRootSCL(asdDB)
		const lastItem = fullPath.at(-1)
		if (rootSCL && lastItem) {
			await asdSDK.ensureRelationship(rootSCL, lastItem)
		}
	}

	// TODO: Move children
	// for (const func of functionToInstantiate) {
	// 	const childRecords = await fsdSDK.findChildRecrods(func)
	// 	console.debug({ level: 'debug', msg: 'finding children', childRecords })
	// }
	// TODO: changes: UUID->TemplateUUID; UUI->New, Path->Recalculate, Add fsdReference
	// TODO: Move + Merge Function Category
	// TODO: Move DatatypeTemplates
	fsdDB.close()
	asdDB.close()
}

async function ensureRecordByAttribute(
	targetDB: Dexie,
	record: DatabaseRecord,
	sourceAttributeName: string,
	targetAttributeName?: string,
): Promise<DatabaseRecord> {
	let _targetAttributeName = targetAttributeName ?? sourceAttributeName

	const attr = extractAttr(record, 'name')
	if (!attr) {
		console.error('could not find name of record', record)
		throw new Error('could not find name of record')
	}
	attr.name = _targetAttributeName

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

async function findRootSCL(db: Dexie): Promise<DatabaseRecord> {
	const scls = (await db.table('SCL').toArray()) as DatabaseRecord[]
	if (scls.length === 0) throw new Error('no root scl found')
	const firstSCL = scls[0]

	return firstSCL
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
