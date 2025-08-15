import { describe, expect, it, vi } from 'vitest'
import { useFileStore } from './data-management.store'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'

describe('Data Management', () => {
	describe('Open and Import File Combinations', () => {
		type TestCase = {
			desc: string
			actionsToPerform: Array<{ type: 'open' | 'import'; fileNames: string[] }>
			expectedActiveFileName: string
		}

		const featureTests: TestCase[] = [
			{
				desc: 'opening a file makes it active',
				actionsToPerform: [{ type: 'open', fileNames: ['just-one-first.asd'] }],
				expectedActiveFileName: 'just-one-first',
			},
			{
				desc: 'when opening multiple files, the first will be the active one',
				actionsToPerform: [
					{ type: 'open', fileNames: ['same-time-first.asd', 'same-time-second.asd'] },
				],
				expectedActiveFileName: 'same-time-first',
			},
			{
				desc: 'when opening two files separately the second will be the active one',
				actionsToPerform: [
					{ type: 'open', fileNames: ['separate-first.asd'] },
					{ type: 'open', fileNames: ['separate-second.asd'] },
				],
				expectedActiveFileName: 'separate-second',
			},
			{
				desc: 'importing a file does not affects the active file',
				actionsToPerform: [
					{ type: 'open', fileNames: ['separate-opened.asd'] },
					{ type: 'import', fileNames: ['separate-imported.asd'] },
				],
				expectedActiveFileName: 'separate-opened',
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				setActivePinia(createPinia())
				const fileStore = useFileStore()

				// Act
				for (const action of tc.actionsToPerform) {
					if (action.type === 'open') {
						files = action.fileNames.map((name) => {
							return new File(['<SCL></SCL>'], name, { type: 'text/plain' })
						})

						await fileStore.openFiles()
					}

					if (action.type === 'import') {
						files = action.fileNames.map((name) => {
							return new File(['<SCL></SCL>'], name, { type: 'text/plain' })
						})

						await fileStore.importFiles()
					}
				}

				// Arrange
				const activeFile = fileStore.currentActiveFileDatabaseName
				expect(activeFile).toEqual(tc.expectedActiveFileName)
			})
		}
	})
})

let files: File[] = []
vi.mock('@vueuse/core', () => ({
	useFileDialog: () => ({
		open: () => {},
		onChange: makeOnChangeMock(files),
	}),
	useStorage: () => ref<string>(''),
	useObjectUrl: () => '',
}))
function makeOnChangeMock(files: File[]): (cb: OnChangeCallback) => void {
	return function (callback: OnChangeCallback) {
		callback(files)
	}
}
// The original uses `FileList` instead of `File[]`,
// but `FIleList` is a read only object that we cannot create
// a `File[]` is equivalent in our use case
type OnChangeCallback = (fileLst: File[]) => Promise<void>
