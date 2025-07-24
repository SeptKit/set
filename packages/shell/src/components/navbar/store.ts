import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// VUEUSE
import { useFileDialog } from '@vueuse/core'
// FILEIO
import { importXmlFiles, exportFile } from '@septkit/fileio'

export const useFileStore = defineStore('file', () => {
	//====== STATE ======//

	const currentActiveFileDatabaseName = ref('')
	const currentImportedDatabaseNames = ref<string[]>([])

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
			// Check if database name is valid
			if (!currentActiveFileDatabaseName.value) {
				console.error('No active file to save - please open a file first')
				return false
			}

			return await exportFile({
				databaseName: currentActiveFileDatabaseName.value,
			})
		} catch (error) {
			console.error('Error saving file:', error)
			return false
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
			currentImportedDatabaseNames.value = databaseNames
		})

		return open()
	}

	return {
		// state
		currentActiveFileDatabaseName,
		currentImportedDatabaseNames,
		// actions
		openFiles,
		saveFile,
		importFile,
	}
})
