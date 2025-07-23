import * as sax from 'sax'
// XML PARSER
import { setSaxParser } from './import.parser'
// DATABASE
import { initializeDatabaseInstance } from './import.database'
// CONSTANTS
import { SUPPORTED_EXTENSIONS } from '../common/common.constant'
// TYPES
import { ImportOptions } from './import.types'

const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
	useBrowserApi: true,
	chunkSize: 32 * 1024, // 32KB
	batchSize: 2000,
}

/**
 * Validates if a file is supported for import
 */
export function isFileSupported(file: File): boolean {
	return SUPPORTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
}

export function getDatabaseName(file: File): string {
	return file.name.replace(/\.[^.]+$/, '')
}

export async function importXmlFiles({
	files,
	options = DEFAULT_IMPORT_OPTIONS,
}: {
	files: File[]
	options?: ImportOptions
}) {
	const databaseNames: string[] = []
	if (files.length === 0) throw new Error('No files provided for import.')

	for (const file of files) {
		if (!isFileSupported(file)) throw new Error(`Unsupported file type: ${file.name}`)

		const databaseName = await importFile({ file, options })
		databaseNames.push(databaseName)
	}
	return databaseNames
}

async function importFile(params: { file: File; options: ImportOptions }) {
	try {
		const databaseName = getDatabaseName(params.file)
		console.log(`Creating database: ${databaseName}`)
		const databaseInstance = initializeDatabaseInstance(databaseName)

		if (params.options.useBrowserApi) {
			const reader = params.file.stream().getReader()
			const xmlParser = setSaxParser(databaseInstance)

			const textDecoder = new TextDecoder()
			const buffer = new Uint8Array(0)
			console.log(`Starting import for file: ${params.file.name}`)
			await createChunks(reader, xmlParser, textDecoder, buffer, params.options.chunkSize)

			console.log(`Import completed for file: ${params.file.name}`)
		}

		return databaseName
	} catch (error) {
		console.error(`Error importing file ${params.file.name}:`, error)
		throw error
	}
}

async function createChunks(
	reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
	xmlParser: sax.SAXParser,
	textDecoder: TextDecoder,
	buffer: Uint8Array,
	chunkSize: number
): Promise<void> {
	const { done, value } = await reader.read()

	console.log(`Read chunk of size: ${value ? value.length : 0}`)
	if (done) {
		// If there's any remaining data in the buffer, send it
		if (buffer.length > 0) {
			const chunk = textDecoder.decode(buffer)
			xmlParser.write(chunk)
		}

		xmlParser.close()
		console.log('All chunks processed, ending parser.')
		return
	}

	// If value is null or undefined, skip this chunk
	if (!value) {
		return await createChunks(reader, xmlParser, textDecoder, buffer, chunkSize)
	}

	// Append new data to buffer
	let newBuffer = new Uint8Array(buffer.length + value.length)
	newBuffer.set(buffer)
	newBuffer.set(value, buffer.length)

	// Process full chunks
	while (newBuffer.length >= chunkSize) {
		const chunkBuffer = newBuffer.slice(0, chunkSize)
		newBuffer = newBuffer.slice(chunkSize)

		const chunk = textDecoder.decode(chunkBuffer, { stream: true })
		xmlParser.write(chunk)
		console.log('Processed chunk of size:', chunkBuffer.length)
	}

	// Continue pumping
	return await createChunks(reader, xmlParser, textDecoder, newBuffer, chunkSize)
}
