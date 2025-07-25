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
		if (!isFileSupported(file)) {
			console.error(`Unsupported file type: ${file.name}`)
			continue
		}

		const t1 = performance.now()
		const databaseName = await importFile({ file, options })
		const t2 = performance.now()
		databaseNames.push(databaseName)

		const importTimeMS = truncateDecimals(t2 - t1, 4)
		const fileSizeMB = truncateDecimals(file.size / Math.pow(1042, 2), 4)
		// console.info({
		// 	msg: 'file import performance',
		// 	fileSizeMB,
		// 	importTimeMS,
		// 	file: file.name,
		// })
	}
	return databaseNames
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

async function importFile(params: { file: File; options: ImportOptions }) {
	const { file, options } = params
	try {
		const databaseName = getDatabaseName(file)

		const databaseInstance = initializeDatabaseInstance(databaseName)

		// console.debug({
		// 	level: 'debug',
		// 	msg: 'importFile',
		// 	databaseName,
		// 	databaseInstance,
		// 	userBrowserAPI: options.useBrowserApi,
		// })

		if (options.useBrowserApi) {
			const reader = file.stream().getReader()
			const xmlParser = setSaxParser({
				databaseInstance,
				options: { batchSize: options.batchSize },
			})

			const textDecoder = new TextDecoder()
			const buffer = new Uint8Array(0)
			await createChunks(reader, xmlParser, textDecoder, buffer, options.chunkSize)
		}

		return databaseName
	} catch (error) {
		console.error(`Error importing file ${file.name}:`, error)
		throw error
	}
}

async function createChunks(
	reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
	xmlParser: sax.SAXParser,
	textDecoder: TextDecoder,
	buffer: Uint8Array,
	chunkSize: number,
): Promise<void> {
	const { done, value } = await reader.read()

	if (done) {
		// If there's any remaining data in the buffer, send it
		if (buffer.length > 0) {
			const chunk = textDecoder.decode(buffer)
			xmlParser.write(chunk)
		}

		xmlParser.close()
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
	}

	// Continue pumping
	return await createChunks(reader, xmlParser, textDecoder, newBuffer, chunkSize)
}

function truncateDecimals(number: number, digits: number) {
	var multiplier = Math.pow(10, digits),
		adjustedNum = number * multiplier,
		truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)

	return truncatedNum / multiplier
}
