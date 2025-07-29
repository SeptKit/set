import { defineStore } from 'pinia'
// VUEUSE
import { useFileDialog, useStorage } from '@vueuse/core'
// FILEIO
import { importXmlFiles, exportFile } from '@septkit/fileio'

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

	return {
		// state
		currentActiveFileDatabaseName,
		currentImportedDatabaseNames,
		// actions
		openFiles,
		saveFile,
		importFile,
	}

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

			if (databaseNames.length) alert(`Files imported successfully: ${databaseNames.join(', ')}`)
		})

		return open()
	}

	async function saveFile() {
		try {
			if (!currentActiveFileDatabaseName.value) {
				throw new Error('No active file to save - please open a file first')
			}

			return await exportFile({
				databaseName: currentActiveFileDatabaseName.value,
			})
		} catch (error) {
			console.error('Error saving file:', error)
			throw error
		}
	}

	async function importFile() {
		const { open, onChange } = useFileDialog({
			accept: 'fsd',
		})

		//====== ACTIONS ======//

		onChange(async (files) => {
			if (!files || files.length === 0) return

			const filesArray = Array.from(files)
			const databaseNames = await importXmlFiles({ files: filesArray })
			currentImportedDatabaseNames.value = [...currentImportedDatabaseNames.value, ...databaseNames]
		})

		return open()
	}
})
