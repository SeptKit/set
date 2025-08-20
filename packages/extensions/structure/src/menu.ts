import { useFileDialog } from '@vueuse/core'
import { importXmlFiles } from '@septkit/fileio'
// TODO: only this seems to work
import type { DatabaseRecord } from '../node_modules/@septkit/fileio/dist/common/common.types'
import Dexie from 'dexie'
import { extractAttr, findRecordByAttribute, updateAttr, useSDK, type SDK } from './sdk'

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
	await instantiateFunctionCategories()

	fsdDB.close()
	asdDB.close()

	async function instantiateFunctions() {
		//
		// Extract File attributes for SCLReferenc
		//
		const header = await fsdDB.table<DatabaseRecord>('Header').orderBy('id').first()
		if (!header) {
			const err = { msg: 'Header element is missing in FSD' }
			console.error(err)
			throw new Error(JSON.stringify(err))
		}
		const fileUuidAttr = extractAttr(header, 'uuid')
		if (!fileUuidAttr) {
			const err = { msg: 'uuid is missing in Header element', header }
			console.error(err)
			throw new Error(JSON.stringify(err))
		}

		const versionAttr = extractAttr(header, 'version')
		if (!versionAttr) {
			const err = { msg: 'version is missing in Header element', header }
			console.error(err)
			throw new Error(JSON.stringify(err))
		}

		const revisionAttr = extractAttr(header, 'revision')
		if (!revisionAttr) {
			const err = { msg: 'revision is missing in Header element', header }
			console.error(err)
			throw new Error(JSON.stringify(err))
		}

		//
		// Function Instantiation
		//
		const functionsToInstantiate = await fsdDB.table<DatabaseRecord>('Function').toArray()

		for (const func of functionsToInstantiate) {
			const path = await extractElementPathTilSCLRoot(fsdDB, func)

			//
			// Ensure Parents exist in ASD
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
			fsdSDK.instantiate(func)
			const funcInASD = await asdSDK.addRecord(func)

			//
			// Add SCL Reference
			//

			// ensure private element
			const privateElements = await fsdSDK.findChildRecordsByTagName(funcInASD, 'Private')

			let private6_100 = privateElements
				.filter((el) => extractAttr(el, 'type')?.value === 'eIEC61850-6-100')
				.at(0)

			if (!private6_100) {
				const newPrivateRecord: Omit<DatabaseRecord, 'id'> = {
					tagName: 'Private',
					attributes: [{ name: 'type', value: 'eIEC61850-6-100' }],
					value: null,
					parent: null,
					namespace: null,
					children: [],
				}
				private6_100 = await asdSDK.addRecord(newPrivateRecord)
				await asdSDK.ensureRelationship(funcInASD, private6_100)
			}

			// SCLFileReference
			const newSCLRef: Omit<DatabaseRecord, 'id'> = {
				tagName: 'SclFileReference',
				namespace: { prefix: 'eIEC61850-6-100', uri: 'http://www.iec.ch/61850/2019/SCL/6-100' },
				attributes: [
					{ name: 'fileType', value: 'FSD' },
					{ name: 'fileUuid', value: fileUuidAttr.value },
					{ name: 'version', value: versionAttr.value },
					{ name: 'revision', value: revisionAttr.value },
				],
				value: null,
				parent: null,
				children: [],
			}
			const sclRefInASD = await asdSDK.addRecord(newSCLRef)
			await asdSDK.ensureRelationship(private6_100, sclRefInASD)

			//
			// Transfer children
			//
			const childrenInFSD = await fsdSDK.findChildRecords(func)
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
			console.info('no data type templates, stopping')
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

		const templatesInFSD = await fsdSDK.findChildRecords(dataTypeTemplatesRecord)
		if (templatesInFSD.length === 0) {
			console.info('DataTypeTemplates is empty, stopping.')
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

	async function instantiateFunctionCategories() {
		const functionCategoriesToInstantiate = await fsdDB
			.table<DatabaseRecord>('FunctionCategory')
			.toArray()

		for (const funcCategoryInFSD of functionCategoriesToInstantiate) {
			const path = await extractElementPathTilSCLRoot(fsdDB, funcCategoryInFSD)
			//
			// Ensure Parents exist in ASD
			//
			const newParentPath: DatabaseRecord[] = []
			// Note: could run parallel
			// Making sure every element exists in the other file
			// Note: We reverse the path so we add the parents first so
			// we can use their new IDs by `ensurePrivateRecordByParent`
			for (const record of path.reverse()) {
				if (isOf(record, ['Substation', 'VoltageLevel', 'Bay'])) {
					const newParent = await ensureRecordByAttribute(asdDB, record, 'name')
					newParentPath.unshift(newParent)
				}
				if (isOf(record, ['Private'])) {
					const newGrandParent = newParentPath[newParentPath.length - 1]
					if (!newGrandParent) {
						const err = {
							msg: 'in the case of function category instantiation private field without a parent (so beeing under SCL root) is considered an error',
							record,
							path,
							newGrandParent,
							newParentPath,
						}
						console.error(err)
						throw new Error(JSON.stringify(err))
					}

					const newParent = await ensurePrivateRecordByParent(asdSDK, record, newGrandParent)
					newParentPath.unshift(newParent)
				}
			}

			//
			// Instantiate and add Function Category to ASD
			//
			const funcCategoryInASD = await instantiateFunctionCategory(funcCategoryInFSD)

			// TODO: change path of imported functions (maybe?)
			// Note: It might not be necessery at this stage because we put the functions
			// at the same level as they were in the FSD so that path is the same.
			// Later when we move functions we should change thier references.

			//
			// Setup relationships in the full path
			//
			const fullPath = [funcCategoryInASD, ...newParentPath]

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

	async function instantiateFunctionCategory(
		funcCatInFSD: DatabaseRecord,
	): Promise<DatabaseRecord> {
		//
		// Ensure Function Category Exists
		//
		const uuidAttr = extractAttr(funcCatInFSD, 'uuid')
		if (!uuidAttr) {
			const err = { msg: 'no uuid found in element', funcCatInFSD }
			console.error(err)
			throw new Error(JSON.stringify(err))
		}

		let funcCategoryInASD = await asdSDK.findOneRecordByAttribute(funcCatInFSD.tagName, {
			name: 'templateUuid',
			value: uuidAttr.value,
		})

		if (!funcCategoryInASD) {
			fsdSDK.instantiate(funcCatInFSD)
			funcCategoryInASD = await asdSDK.addRecord(funcCatInFSD)
		}

		//
		// Instantiate FunctionCatRefs
		//
		const funcCatRefsInFSD = await fsdSDK.findChildRecordsByTagName(funcCatInFSD, 'FunctionCatRef')
		for (const funcCatRefInFSD of funcCatRefsInFSD) {
			const funcCatRefInASD = await asdSDK.addRecord(funcCatRefInFSD)
			await asdSDK.ensureRelationship(funcCategoryInASD, funcCatRefInASD)

			// Update `functionUuid`
			const functionUuidAttr = extractAttr(funcCatRefInASD, 'functionUuid')
			if (!functionUuidAttr) continue

			const funcInASD = await asdSDK.findOneRecordByAttribute('Function', {
				name: 'templateUuid',
				value: functionUuidAttr.value,
			})
			if (!funcInASD) {
				const err = { msg: 'could not found function by templateUuid', functionUuidAttr }
				console.error(err)
				throw new Error(JSON.stringify(err))
			}

			const uuidAttr = extractAttr(funcInASD, 'uuid')
			if (!uuidAttr) {
				const err = { msg: 'function does not have an uuid', funcInASD }
				console.error(err)
				throw new Error(JSON.stringify(err))
			}

			updateAttr(funcCatRefInASD, 'functionUuid', uuidAttr?.value)
			await asdSDK.updateRecord(funcCatRefInASD)
		}

		//
		// Instantiate SubCategories recursively
		//
		const subCategoriesInFSD = await fsdSDK.findChildRecordsByTagName(funcCatInFSD, 'SubCategory')
		for (const subCategoryInFSD of subCategoriesInFSD) {
			const subCategoryInASD = await instantiateFunctionCategory(subCategoryInFSD)
			await asdSDK.ensureRelationship(funcCategoryInASD, subCategoryInASD)
		}

		return funcCategoryInASD
	}

	async function transferFromFSDToASDWithChildrenRecursively(
		recordInFSD: DatabaseRecord,
	): Promise<DatabaseRecord> {
		const recordInASD = await asdSDK.addRecord(recordInFSD)
		const childrenInFSD = await fsdSDK.findChildRecords(recordInFSD)
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

async function ensurePrivateRecordByParent(
	targetSDK: SDK,
	privateRecord: DatabaseRecord,
	parentRecord: DatabaseRecord,
): Promise<DatabaseRecord> {
	const typeAttr = extractAttr(privateRecord, 'type')
	if (!typeAttr || !typeAttr.value) {
		const err = {
			msg: 'type attribute is required but it is missing or empty',
			typeAttr,
			record: privateRecord,
		}
		console.error(err)
		throw new Error(JSON.stringify(err))
	}

	const existingElement = await targetSDK.db
		.table<DatabaseRecord>(privateRecord.tagName)
		.where('parent.id')
		.equals(parentRecord.id)
		.filter((record) =>
			Boolean(record.attributes?.some((a) => a.name === 'type' && a.value === typeAttr.value)),
		)
		.first()

	if (existingElement) {
		return existingElement
	}

	const newElement = await targetSDK.addRecord(privateRecord)

	return newElement
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
