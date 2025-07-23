# XML to IndexedDB Importer

A UI-agnostic module for importing large XML files into IndexedDB.

## Features

- 📊 Dynamic table creation based on XML element structure
- 🧩 Incremental processing of XML data in chunks
- 📦 Batch inserts for optimal performance
- 🔄 Streaming file reading using the Streams API
- 📱 UI-agnostic design - works with any framework
- 🛠️ Flexible implementation - can be run in the main thread or workers

## Installation

```bash
# With npm
npm install @septkit/fileio

# With pnpm
pnpm add @septkit/fileio

# With yarn
yarn add @septkit/fileio
```

## Usage

### Basic Usage

```typescript
import { importXmlFile } from '@septkit/fileio'

// Import a file with progress tracking
async function handleFileUpload(file: File) {
	try {
		await importXmlFile(file, {
			onProgress: (progress) => {
				console.log(`Progress: ${progress.percentComplete}%`)
			},
			onComplete: (result) => {
				console.log(`Import completed. Processed ${result.stats.elementsProcessed} elements.`)
			},
			onError: (error) => {
				console.error(`Error: ${error.message}`)
			},
		})
	} catch (error) {
		console.error('Import failed:', error)
	}
}

// In a file input handler
document.getElementById('fileInput').addEventListener('change', (event) => {
	const file = event.target.files[0]
	if (file) {
		handleFileUpload(file)
	}
})
```

### Querying Imported Data

```typescript
import { queryImportedData } from '@septkit/fileio'

async function queryData() {
	// The database name is derived from the file name without extension
	const dbName = 'myXmlFile' // If the imported file was myXmlFile.xml
	const tableName = 'ElementName' // The name of an XML element in the file

	try {
		const records = await queryImportedData(dbName, tableName, async (table) => {
			// Use Dexie.js query methods
			return await table.toArray()
		})

		console.log(`Found ${records.length} records`)
		console.log(records)
	} catch (error) {
		console.error('Query failed:', error)
	}
}
```

### Advanced Usage

For more control, you can create an instance of the `XmlImporter` class:

```typescript
import { createXmlImporter } from '@septkit/fileio'

const importer = createXmlImporter()

try {
	await importer.importFile(file, {
		// Your handlers here
	})
} finally {
	// Always destroy the importer when done to clean up resources
	importer.destroy()
}
```

## How It Works

1. The module reads the XML file in chunks using the Streams API
2. Each chunk is sent to a Web Worker for processing
3. The worker parses the XML incrementally using sax-js
4. For each new element type encountered, a new table is created dynamically
5. Records are collected and inserted in batches for optimal performance
6. Progress updates are sent back to the main thread for UI updates

## Database Structure

- Each XML file creates a separate IndexedDB database named after the file
- Each unique XML element type gets its own table
- Element attributes become columns in the table
- Special fields:
  - `_text`: The text content of the element
  - `_path`: The full path to the element in the XML structure

## Supported File Types

By default, the module supports the following XML file extensions:
`.fsd`, `.asd`, `.ssd`, `.scd`

## Browser Support

This module uses modern browser APIs including:

- Web Workers
- Streams API
- IndexedDB
- TextDecoder

Ensure your target browsers support these features or use appropriate polyfills.
