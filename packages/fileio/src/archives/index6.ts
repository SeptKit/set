/**
 * XML to IndexedDB Importer Module
 *
 * This module provides functionality for importing large XML files into IndexedDB.
 * This version exposes the core functionality without using Web Workers,
 * allowing the consuming application to decide how to handle threading.
 */
import { type Table } from 'dexie'
import Dexie from 'dexie'
import * as sax from 'sax'

// Constants
const SUPPORTED_EXTENSIONS = ['.fsd', '.asd', '.ssd', '.scd']
const BATCH_SIZE = 2000 // Number of records to batch before writing to IndexedDB
const _CHUNK_SIZE = 32 * 1024 // 32 KB chunks for reading files (unused but kept for reference)
const PROGRESS_UPDATE_INTERVAL = 1000 // Update progress every 1000ms

// Type definitions for import progress and results
export type ImportProgress = {
	type: 'progress'
	fileName: string
	bytesProcessed: number
	totalBytes: number
	elementsProcessed: number
	tablesCreated: string[]
	percentComplete: number
}

export type ImportError = {
	type: 'error'
	fileName: string
	message: string
	stack?: string
}

export type ImportComplete = {
	type: 'complete'
	fileName: string
	stats: {
		bytesProcessed: number
		elementsProcessed: number
		tablesCreated: string[]
		totalTables: number
		totalRecords: number
		duration: number
	}
}

// Event handlers interface
export interface ImportEventHandlers {
	onProgress?: (progress: ImportProgress) => void
	onError?: (error: ImportError) => void
	onComplete?: (stats: ImportComplete) => void
}

// Type definition for the XML importer interface
export interface XmlImporter {
	importFile: (file: File, handlers?: ImportEventHandlers) => Promise<void>
	abort: () => void
}

/**
 * Parser state interface for the XML parsing process
 */
interface ParserState {
	currentPath: string[]
	currentElement: string | null
	currentAttributes: Record<string, any>
	currentText: string
	tablesCreated: Set<string>
	tables: Record<string, Record<string, any>[]>
	db: Dexie | null
	bytesProcessed: number
	totalBytes: number
	elementsProcessed: number
	fileName: string
	dbName: string
	lastProgressUpdate: number
	startTime: number
	isAborting: boolean
}

/**
 * Validates if a file is supported for import
 */
function isFileSupported(file: File): boolean {
	return SUPPORTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
}

/**
 * Creates an XML importer with the necessary functions to handle the import process
 */
export function createXmlImporter(): XmlImporter {
	// Private state
	let activeImport = false
	let handlers: ImportEventHandlers = {}
	let abortController: AbortController | null = null

	/**
	 * Initialize the database for the current import
	 */
	function initializeDatabase(dbName: string) {
		// Create a new database instance
		const db = new Dexie(dbName)

		// Initialize with empty schema, will be updated dynamically
		db.version(1).stores({})
		console.log(`Database "${dbName}" initialized`)
		return db
	}

	/**
	 * Reset the parser state for a new import
	 */
	function createInitialState(fileName: string, dbName: string, fileSize: number): ParserState {
		return {
			currentPath: [],
			currentElement: null,
			currentAttributes: {},
			currentText: '',
			tablesCreated: new Set<string>(),
			tables: {},
			db: initializeDatabase(dbName),
			bytesProcessed: 0,
			totalBytes: fileSize,
			elementsProcessed: 0,
			fileName: fileName,
			dbName: dbName,
			lastProgressUpdate: 0,
			startTime: Date.now(),
			isAborting: false,
		}
	}

	/**
	 * Create a table in the database if it doesn't exist
	 */
	async function createTableIfNeeded(
		state: ParserState,
		tableName: string,
		attributes: Record<string, any>,
	) {
		if (state.tablesCreated.has(tableName)) {
			console.log(`Table "${tableName}" already exists, skipping creation`)
			return
		}

		// Get attribute names to create columns
		const attributeKeys = Object.keys(attributes)

		// Create schema
		const schema: Record<string, string> = { id: '++id' }

		// Add all attributes as string columns
		if (attributeKeys.length > 0) {
			attributeKeys.forEach((key) => {
				schema[key] = 'string'
			})
		}

		await updateDatabaseSchema(state, tableName, schema)
	}

	/**
	 * Update the database schema to include a new table
	 */
	async function updateDatabaseSchema(
		state: ParserState,
		tableName: string,
		schema: Record<string, string>,
	) {
		if (!state.db) {
			throw new Error('Database not initialized')
		}

		// Close the current database
		state.db.close()

		// Create a new version with the updated schema
		const newVersion = state.db.verno + 1
		const db = new Dexie(state.dbName)

		// Get existing tables
		const existingStores: Record<string, string> = {}
		state.tablesCreated.forEach((name) => {
			existingStores[name] = state.db!.table(name).schema.primKey.src
		})

		// Add the new table
		existingStores[tableName] = Object.entries(schema)
			.map(([key, value]) => `${key}${value.startsWith('++') ? value : ''}`)
			.join(',')

		// Update the schema
		db.version(newVersion).stores(existingStores)

		// Open the database with the new schema
		await db.open()

		// Update state
		state.db = db
		state.tablesCreated.add(tableName)

		// Initialize the table array if needed
		if (!state.tables[tableName]) {
			state.tables[tableName] = []
		}
	}

	/**
	 * Add a record to the appropriate table
	 */
	function addRecord(state: ParserState, tableName: string, record: Record<string, any>) {
		// Initialize table array if needed
		if (!state.tables[tableName]) {
			state.tables[tableName] = []
		}

		// Add record to the table
		state.tables[tableName].push(record)

		// Process batch if needed
		if (state.tables[tableName].length >= BATCH_SIZE) {
			processBatch(state, tableName).catch((error) => {
				sendError(`Failed to process batch for table ${tableName}: ${error}`)
			})
		}
	}

	/**
	 * Process a batch of records for a specific table
	 */
	async function processBatch(state: ParserState, tableName: string) {
		if (!state.db) {
			throw new Error('Database not initialized')
		}

		const records = state.tables[tableName]
		if (!records || records.length === 0) {
			return
		}

		try {
			// Bulk insert records into the table
			await state.db.table(tableName).bulkAdd(records)

			// Clear the processed records
			state.tables[tableName] = []
		} catch (error) {
			sendError(`Error inserting records into table ${tableName}: ${error}`)
		}
	}

	/**
	 * Process all pending batches
	 */
	async function processAllBatches(state: ParserState) {
		const tableNames = Object.keys(state.tables)

		for (const tableName of tableNames) {
			if (state.tables[tableName].length > 0) {
				await processBatch(state, tableName)
			}
		}
	}

	/**
	 * Send a progress update to the consumer
	 */
	function sendProgress(state: ParserState, force = false) {
		const now = Date.now()

		// Limit progress updates to avoid too many updates
		if (!force && now - state.lastProgressUpdate < PROGRESS_UPDATE_INTERVAL) {
			return
		}

		state.lastProgressUpdate = now

		if (handlers.onProgress) {
			handlers.onProgress({
				type: 'progress',
				fileName: state.fileName,
				bytesProcessed: state.bytesProcessed,
				totalBytes: state.totalBytes,
				elementsProcessed: state.elementsProcessed,
				tablesCreated: Array.from(state.tablesCreated),
				percentComplete:
					state.totalBytes > 0 ? Math.round((state.bytesProcessed / state.totalBytes) * 100) : 0,
			})
		}
	}

	/**
	 * Send completion message to the consumer
	 */
	function sendComplete(state: ParserState) {
		const duration = Date.now() - state.startTime

		// Count total records
		let totalRecords = 0
		Object.values(state.tables).forEach((records) => {
			totalRecords += records.length
		})

		if (handlers.onComplete) {
			handlers.onComplete({
				type: 'complete',
				fileName: state.fileName,
				stats: {
					bytesProcessed: state.bytesProcessed,
					elementsProcessed: state.elementsProcessed,
					tablesCreated: Array.from(state.tablesCreated),
					totalTables: state.tablesCreated.size,
					totalRecords: totalRecords,
					duration: duration,
				},
			})
		}
	}

	/**
	 * Send an error message to the consumer
	 */
	function sendError(message: string, stack?: string) {
		activeImport = false

		if (handlers.onError) {
			handlers.onError({
				type: 'error',
				fileName: '', // Will be overridden in importFile if available
				message: message,
				stack: stack,
			})
		}
	}

	/**
	 * Parse the XML content
	 */
	async function parseXmlContent(state: ParserState, content: string): Promise<void> {
		return new Promise((resolve, reject) => {
			// Initialize the SAX parser
			const parser = sax.parser(true) // strict mode

			// Set up parser event handlers
			parser.onerror = function (error) {
				reject(new Error(`XML parsing error: ${error}`))
			}

			parser.onopentag = function (node) {
				if (state.isAborting) return

				state.currentPath.push(node.name)
				state.currentElement = node.name
				state.currentAttributes = node.attributes
				state.currentText = ''

				// Create table for this element if it doesn't exist
				const tableName = node.name
				// console.log(state)
				// if (!state.tablesCreated.has(tableName)) {
				createTableIfNeeded(state, tableName, node.attributes).catch((error) => {
					reject(new Error(`Failed to create table ${tableName}: ${error}`))
				})
				// }
			}

			parser.ontext = function (text) {
				if (state.isAborting) return

				if (state.currentElement) {
					state.currentText += text
				}
			}

			parser.onclosetag = function (tagName) {
				if (state.isAborting) return

				if (state.currentElement === tagName) {
					// Create a record from current element data
					const record = {
						...state.currentAttributes,
						_text: state.currentText.trim(),
						_path: state.currentPath.join('/'),
					}

					// Add record to the appropriate table
					addRecord(state, tagName, record)

					state.elementsProcessed++
				}

				// Pop from path
				state.currentPath.pop()
				state.currentElement =
					state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : null
				state.currentAttributes = {}
				state.currentText = ''

				// Send occasional progress updates
				sendProgress(state)
			}

			parser.onend = function () {
				resolve()
			}

			// Parse the content
			parser.write(content).close()
		})
	}

	/**
	 * Process a file in chunks and parse the XML
	 */
	async function processFileInChunks(file: File, dbName: string): Promise<void> {
		// Initialize state
		const state = createInitialState(file.name, dbName, file.size)

		try {
			// Create a reader for the file
			const reader = file.stream().getReader()
			abortController = new AbortController()
			const signal = abortController.signal

			// Check for abort
			signal.addEventListener('abort', () => {
				state.isAborting = true
				reader.cancel().catch(() => {}) // Ignore errors during cancellation
			})

			let bytesRead = 0
			let textDecoder = new TextDecoder()
			let xmlContent = ''

			// Read chunks until done
			while (true) {
				if (state.isAborting) {
					throw new Error('Import aborted by user')
				}

				const { value, done } = await reader.read()

				if (done) {
					break
				}

				if (value) {
					bytesRead += value.length
					state.bytesProcessed = bytesRead

					// Decode chunk to text
					const chunk = textDecoder.decode(value, { stream: true })
					xmlContent += chunk

					// Report progress
					sendProgress(state)
				}
			}

			// Parse the complete XML
			console.log(`Parsing XML content (${bytesRead} bytes)`)
			await parseXmlContent(state, xmlContent)

			// Process any remaining batches
			await processAllBatches(state)

			// Send final progress and completion
			sendProgress(state, true)
			sendComplete(state)

			// Close the database
			if (state.db) {
				state.db.close()
			}
		} catch (error) {
			// Clean up database
			if (state.db) {
				state.db.close()
			}

			// Forward the error
			throw error
		} finally {
			abortController = null
		}
	}

	/**
	 * Import an XML file into IndexedDB
	 * @param file The XML file to import
	 * @param eventHandlers Event handlers for the import process
	 */
	async function importFile(file: File, eventHandlers: ImportEventHandlers = {}): Promise<void> {
		if (activeImport) {
			return Promise.reject(new Error('An import is already in progress'))
		}

		if (!isFileSupported(file)) {
			return Promise.reject(new Error(`Unsupported file type: ${file.name}`))
		}

		handlers = eventHandlers
		activeImport = true

		// Create a database name from the file name (without extension)
		const dbName = file.name.replace(/\.[^.]+$/, '')
		console.log(`Importing file "${file.name}" into database "${dbName}"`)

		try {
			await processFileInChunks(file, dbName)
		} catch (error) {
			activeImport = false
			if (handlers.onError) {
				handlers.onError({
					type: 'error',
					fileName: file.name,
					message: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
				})
			}
			throw error
		} finally {
			activeImport = false
		}
	}

	/**
	 * Abort the current import process
	 */
	function abort(): void {
		if (abortController) {
			abortController.abort()
		}
	}

	// Return public interface
	return {
		importFile,
		abort,
	}
}

/**
 * Convenience function to import a single file
 */
export async function importXmlFile(file: File, handlers: ImportEventHandlers = {}): Promise<void> {
	const importer = createXmlImporter()

	try {
		await importer.importFile(file, handlers)
	} finally {
		importer.abort() // Ensure any ongoing operations are cleaned up
	}
}

/**
 * Query a database table that was created by the importer
 *
 * @param dbName The name of the database to query
 * @param tableName The name of the table to query
 * @param query A function that takes a Dexie Table and returns a promise with query results
 */
export async function queryImportedData<T>(
	dbName: string,
	tableName: string,
	query: (table: Table) => Promise<T>,
): Promise<T> {
	const Dexie = (await import('dexie')).default
	const db = new Dexie(dbName)

	try {
		// Open the database, which should already have its schema defined
		await db.open()

		// Check if the table exists
		if (!db.tables.some((table) => table.name === tableName)) {
			throw new Error(`Table "${tableName}" does not exist in database "${dbName}"`)
		}

		// Execute the query
		return await query(db.table(tableName))
	} finally {
		db.close()
	}
}
