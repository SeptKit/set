import * as sax from 'sax'
// XML PARSER
import { setSaxParser } from './import.parser'
// DATABASE
import { deleteDatabaseIfExists, initializeDatabaseInstance } from './import.database'
// CONSTANTS
import { SUPPORTED_EXTENSIONS } from '../common/common.constant'
// QUEUE
import { createQueuesObservable, areAllQueuesDone } from './import.queue'
// TYPES
import type { ImportOptions, ReaderOptions, ImportContext } from './import.types'

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

		if (file.size === 0) {
			console.warn(`File is empty: ${file.name}`)
			continue
		}

		const databaseName = await importFile({ file, options })

		databaseNames.push(databaseName)
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
		await deleteDatabaseIfExists(databaseName)

		const databaseInstance = initializeDatabaseInstance(databaseName)

		let importContext: ImportContext = {
			databaseInstance,
			options: {
				batchSize: options.batchSize,
			},
			queues: {},
			endingQueues: {},
			queuesObservable: createQueuesObservable({}),
			endingQueuesObservable: createQueuesObservable({}),
		}

		if (options.useBrowserApi) {
			importContext = await processXmlWithBrowserApi({
				file,
				importContext,
				options: {
					chunkSize: options.chunkSize,
				},
			})
		}

		await areAllQueuesDone({
			importContext,
		})

		return databaseName
	} catch (error) {
		console.error(`Error importing file ${file.name}:`, error)
		throw error
	}
}

async function processXmlWithBrowserApi(params: {
	file: File
	importContext: ImportContext
	options: ReaderOptions
}): Promise<ImportContext> {
	const { file, importContext, options } = params

	const reader = file.stream().getReader()
	const { xmlParser, importContext: updatedImportContext } = setSaxParser({
		importContext,
	})

	const textDecoder = new TextDecoder()
	const buffer = new Uint8Array(0)
	await createChunks(reader, xmlParser, textDecoder, buffer, options)

	return updatedImportContext
}

async function createChunks(
	reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
	xmlParser: sax.SAXParser,
	textDecoder: TextDecoder,
	buffer: Uint8Array,
	options: ReaderOptions,
): Promise<void> {
	const chunkSize = options.chunkSize
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
		return await createChunks(reader, xmlParser, textDecoder, buffer, options)
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
	return await createChunks(reader, xmlParser, textDecoder, newBuffer, options)
}
