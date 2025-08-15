import Dexie from 'dexie'
// GUARDS
import { isQualifiedAttribute } from '@/common/common.guards'
// TYPES
import { DatabaseInstance, DatabaseRecord, AvailableTagName } from '@/common/common.types'

//====== PUBLIC FUNCTIONS ======//

export async function exportFile(params: {
	databaseName: string
}): Promise<{ xmlDocument: XMLDocument; filename: string }> {
	const databaseInstance = new Dexie(params.databaseName) as DatabaseInstance
	await databaseInstance.open()

	const xmlDocument = await rebuildXmlFromIndexedDB({
		databaseInstance: databaseInstance,
		useBrowserApi: true,
	})

	if (!xmlDocument) {
		throw new Error('Failed to rebuild XML document from IndexedDB.')
	}

	return {
		xmlDocument,
		filename: databaseInstance.name + '.scd',
	}
}

//====== PRIVATE FUNCTIONS ======//

async function rebuildXmlFromIndexedDB(params: {
	databaseInstance: DatabaseInstance
	useBrowserApi: boolean
}) {
	if (params.useBrowserApi) {
		const emptyXmlDocument = document.implementation.createDocument(
			'http://www.iec.ch/61850/2003/SCL',
			null,
			null,
		)

		const sclElement = (await params.databaseInstance.table('SCL').toArray())?.[0]
		if (!sclElement) throw new Error('No SCL root element found in DB')

		const rootElement = createElementWithAttributesAndText({
			document: emptyXmlDocument,
			record: sclElement,
		})

		emptyXmlDocument.appendChild(rootElement)

		// Recursively build the tree structure
		return await recursivelyBuildXmlTree({
			databaseInstance: params.databaseInstance,
			xmlDocument: emptyXmlDocument,
			rawElement: sclElement,
			parentDomElement: rootElement,
		})
	}
}

async function recursivelyBuildXmlTree(params: {
	databaseInstance: DatabaseInstance
	xmlDocument: XMLDocument
	rawElement: DatabaseRecord
	parentDomElement: Element
}) {
	if (!params.rawElement.children) return

	const childrenPerTagNames = params.rawElement.children.reduce(
		(acc, child) => {
			acc[child.tagName] = [...(acc[child.tagName] || []), child.id]
			return acc
		},
		{} as Record<Partial<AvailableTagName>, string[]>,
	)

	const childrenPerTagNamesEntries = Object.entries(childrenPerTagNames) as [
		Partial<AvailableTagName>,
		string[],
	][]

	const childrenPromises = childrenPerTagNamesEntries.map(async ([tagName, children]) => {
		const currentTable = params.databaseInstance.table(tagName)
		const currentChildrenRecord = await currentTable.bulkGet(children)

		for (const child of currentChildrenRecord) {
			if (!child) continue // Skip if child is not found

			const childElement = createElementWithAttributesAndText({
				document: params.xmlDocument,
				record: child,
			})

			// Add the child element to the parent DOM element
			params.parentDomElement.appendChild(childElement)

			// Recursively process children
			await recursivelyBuildXmlTree({
				databaseInstance: params.databaseInstance,
				xmlDocument: params.xmlDocument,
				rawElement: child,
				parentDomElement: childElement,
			})
		}
	})

	await Promise.all(childrenPromises)

	return params.xmlDocument
}

function createElementWithAttributesAndText(params: {
	document: XMLDocument
	record: DatabaseRecord
}): Element {
	const { document, record } = params
	let element: Element

	if (record.namespace) {
		addNamespaceToRootElementIfNeeded({
			document,
			namespace: record.namespace,
		})
		element = document.createElement(`${record.namespace.prefix}:${record.tagName}`)
	} else element = document.createElement(record.tagName)

	if (record.attributes)
		for (const attribute of record.attributes) {
			if (isQualifiedAttribute(attribute))
				addNamespaceToRootElementIfNeeded({
					document,
					namespace: attribute.namespace,
				})

			element.setAttribute(attribute.name, String(attribute.value))
		}

	if (record.value) element.textContent = record.value.trim()

	return element
}

function addNamespaceToRootElementIfNeeded(params: {
	document: XMLDocument
	namespace: { prefix: string; uri: string }
}) {
	const { document, namespace } = params
	const rootElement = document.documentElement
	if (!rootElement) return

	const isDefaultNamespace =
		namespace.prefix === 'xmlns' && namespace.uri === 'http://www.w3.org/2000/xmlns/'

	const hasNamespace = rootElement.getAttribute(`xmlns:${namespace.prefix}`) !== null

	if (!hasNamespace && !isDefaultNamespace)
		rootElement.setAttribute(`xmlns:${namespace.prefix}`, namespace.uri)
}
