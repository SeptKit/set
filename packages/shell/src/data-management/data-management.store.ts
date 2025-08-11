import { defineStore } from 'pinia'
// VUEUSE
import { useFileDialog, useStorage, useObjectUrl } from '@vueuse/core'
// FILEIO
import { importXmlFiles, exportFile, formatXml } from '@septkit/fileio'

export const useFileStore = defineStore('file', () => {
	//====== STATE ======//

	const currentActiveFileDatabaseName = useStorage<string>(
		'currentActiveFileDatabaseName',
		'',
		localStorage,
	)
	const currentImportedDatabaseNames = useStorage<string[]>(
		'currentImportedDatabaseNames',
		[],
		localStorage,
	)

	//====== ACTIONS ======//

	async function openFiles() {
		const { open, onChange } = useFileDialog({
			accept: 'asd',
		})

		//====== ACTIONS ======//

		onChange(async (files) => {
			if (!files || files.length === 0) return

			const filesArray = Array.from(files)
			const databaseNames = await importXmlFiles({ files: filesArray })
			currentActiveFileDatabaseName.value = databaseNames[0]
			if (databaseNames.length) {
				console.info(`Files imported successfully: ${databaseNames.join(', ')}`)
			}
		})

		return open()
	}

	async function saveFile() {
		try {
			if (!currentActiveFileDatabaseName.value) {
				throw new Error('No active file to save - please open a file first')
			}

			const response = await exportFile({
				databaseName: currentActiveFileDatabaseName.value,
			})

			const serializer = new XMLSerializer()
			const xmlString = serializer.serializeToString(response.xmlDocument)

			const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n'
			const xmlWithDeclaration = xmlDeclaration + xmlString

			const formattedXmlString = formatXml(xmlWithDeclaration)

			const blob = new Blob([formattedXmlString], { type: 'application/xml' })
			const url = useObjectUrl(blob)

			if (!url.value) throw new Error('Failed to create object URL for the XML document')

			const a = document.createElement('a')
			a.href = url.value
			a.download = response.filename
			document.body.appendChild(a)
			a.click()

			setTimeout(() => {
				document.body.removeChild(a)
			}, 0)
		} catch (error) {
			console.error('Error saving file:', error)
			throw error
		}
	}

	async function importFiles() {
		const { open, onChange } = useFileDialog({
			accept: 'fsd',
		})

		onChange(async (files) => {
			if (!files || files.length === 0) return

			const filesArray = Array.from(files)
			const databaseNames = await importXmlFiles({ files: filesArray })
			currentImportedDatabaseNames.value = [...currentImportedDatabaseNames.value, ...databaseNames]
		})

		return open()
	}

	//====== RETURNED STORE PROPERTIES ======//

	return {
		// state
		currentActiveFileDatabaseName,
		currentImportedDatabaseNames,
		// actions
		openFiles,
		saveFile,
		importFiles,
	}
})
