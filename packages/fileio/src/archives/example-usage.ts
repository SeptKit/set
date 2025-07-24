/**
 * Example usage of the XML to IndexedDB importer
 *
 * This file demonstrates how to use the module to import XML files and query the data.
 */
import { importXmlFile, queryImportedData, type ImportProgress, type ImportComplete } from './index'

/**
 * Import a single XML file with progress tracking
 */
async function importSingleFile(file: File): Promise<void> {
	try {
		await importXmlFile(file, {
			onProgress: function (progress: ImportProgress) {
				console.log(`Processing ${progress.fileName}: ${progress.percentComplete}% complete`)
				console.log(`Processed ${progress.bytesProcessed} bytes of ${progress.totalBytes} total`)
				console.log(`Elements processed: ${progress.elementsProcessed}`)
				console.log(`Tables created: ${progress.tablesCreated.join(', ')}`)

				// Update UI with progress information (implementation depends on your UI framework)
				updateProgressUI(progress.percentComplete)
			},

			onError: function (error) {
				console.error(`Error importing ${error.fileName}: ${error.message}`)
				// Show error in UI
				showErrorUI(error.message)
			},

			onComplete: function (result: ImportComplete) {
				console.log(`Import of ${result.fileName} completed successfully!`)
				console.log(`Stats: ${result.stats.elementsProcessed} elements processed`)
				console.log(`Tables created: ${result.stats.tablesCreated.join(', ')}`)
				console.log(`Duration: ${result.stats.duration}ms`)

				// Update UI to show completion
				showCompletionUI(result)
			},
		})

		console.log('Import completed successfully')
	} catch (error) {
		console.error('Import failed:', error)
	}
}

/**
 * Handle file input change event in a web application
 */
function handleFileInputChange(event: Event): void {
	const input = event.target as HTMLInputElement

	if (input.files && input.files.length > 0) {
		const file = input.files[0]
		importSingleFile(file)
	}
}

/**
 * Query data from an imported database
 */
async function queryImportedXmlData(dbName: string, tableName: string): Promise<any[]> {
	try {
		const results = await queryImportedData(dbName, tableName, async (table) => {
			// Query all records in the table
			return await table.toArray()
		})

		console.log(`Found ${results.length} records in table ${tableName}`)
		return results
	} catch (error) {
		console.error(`Error querying data: ${error}`)
		throw error
	}
}

/**
 * Find specific records matching a condition
 */
async function findSpecificRecords(
	dbName: string,
	tableName: string,
	attributeName: string,
	value: string,
): Promise<any[]> {
	try {
		const results = await queryImportedData(dbName, tableName, async (table) => {
			// Query records where the specified attribute matches the value
			return await table.where(attributeName).equals(value).toArray()
		})

		console.log(
			`Found ${results.length} records in table ${tableName} where ${attributeName} = ${value}`,
		)
		return results
	} catch (error) {
		console.error(`Error querying data: ${error}`)
		throw error
	}
}

// UI update functions (implementation would depend on your UI framework)
function updateProgressUI(percentComplete: number): void {
	// Example implementation for updating a progress bar
	const progressBar = document.getElementById('progress-bar')
	if (progressBar) {
		progressBar.style.width = `${percentComplete}%`
		progressBar.setAttribute('aria-valuenow', String(percentComplete))
	}
}

function showErrorUI(message: string): void {
	// Example implementation for showing an error message
	const errorElement = document.getElementById('error-message')
	if (errorElement) {
		errorElement.textContent = message
		errorElement.style.display = 'block'
	}
}

function showCompletionUI(result: ImportComplete): void {
	// Example implementation for showing completion message
	const completionElement = document.getElementById('completion-message')
	if (completionElement) {
		completionElement.textContent = `Import completed: ${result.stats.elementsProcessed} elements processed in ${result.stats.duration}ms`
		completionElement.style.display = 'block'
	}
}

// Setup event listener for file input (if used in a web application)
function setupFileInput(): void {
	const fileInput = document.getElementById('xml-file-input')
	if (fileInput) {
		fileInput.addEventListener('change', handleFileInputChange)
	}
}

// Initialize when DOM is ready (if used in a web application)
if (typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', setupFileInput)
}

// Export functions for use in other modules
export { importSingleFile, queryImportedXmlData, findSpecificRecords }
