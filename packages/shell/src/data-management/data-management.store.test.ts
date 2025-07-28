import { describe, expect, it, vi } from 'vitest'
import { useFileStore } from './data-management.store'
import { createPinia, setActivePinia } from 'pinia'
import { useStorage as useStorageOriginal } from '@vueuse/core'
import { ref } from 'vue'

describe('Data Management', () => {
	describe('Feature', () => {
		type TestCase = {
			desc: string
		}

		const featureTests: TestCase[] = [
			{
				desc: 'first test',
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				setActivePinia(createPinia())
				const fileStore = useFileStore()

				vi.mock('@vueuse/core', () => ({
					useFileDialog: () => ({
						open: () => {},
						onChange: (callback: (file: File[]) => Promise<void>) => {
							const fileList: File[] = [
								new File([''], 'first.asd', {
									type: 'text/plain',
								}),
								new File([''], 'second.asd', {
									type: 'text/plain',
								}),
							]
							callback(fileList)
						},
					}),
					useStorage: () => {
						return ref<string>('')
					},
				}))

				// Act
				await fileStore.openFiles()

				// Arrange
				const activeFile = fileStore.currentActiveFileDatabaseName
				expect(activeFile).toEqual('first')
			})
		}
	})
})
