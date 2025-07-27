import { describe, expect, it, vi } from 'vitest'
import type { Extension } from '../extension/extension'
import { useExtensionStore } from '../extension/extension-store'
import { render } from 'vitest-browser-vue'
import { createPinia, setActivePinia } from 'pinia'
import Menu from './menu.vue'

describe('Menu', () => {
	describe('configuration through extensions', () => {
		type TestCase = {
			desc: string
			extensions: Extension[]
			clickOnLabels: string[]
			expectedVisibleLabels: string[]
			expectedInvisibleLabel: string[]
		}

		const featureTests: TestCase[] = [
			{
				desc: 'a main item',
				extensions: [
					{
						id: 'ext-with-main-item',
						label: 'Test Extension',
						version: '0.0.1-test',
						contributions: [
							{
								id: 'test.main-item',
								type: 'menu',
								label: 'Main Item',
								menuPath: [],
								actionFnUrl: '',
							},
						],
					},
				],
				clickOnLabels: [],
				expectedVisibleLabels: ['Main Item'],
				expectedInvisibleLabel: [],
			},
			{
				desc: 'a sub item',
				extensions: [
					{
						id: 'ext-with-sub-item',
						label: 'Test Extension With Sub Item',
						version: '0.0.1-test',
						contributions: [
							{
								id: 'test.sub-item',
								type: 'menu',
								label: 'Sub Item',
								menuPath: ['Main Item'],
								actionFnUrl: '',
							},
						],
					},
				],
				clickOnLabels: ['Main Item'],
				expectedVisibleLabels: ['Sub Item'],
				expectedInvisibleLabel: [],
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				setActivePinia(createPinia())
				const store = useExtensionStore()

				store.setExtensions(tc.extensions)

				const screen = render(Menu)

				// Act
				for (const label of tc.clickOnLabels) {
					await screen.getByText(label).click()
				}

				// Assert
				for (const label of tc.expectedVisibleLabels) {
					await expect.element(screen.getByText(label)).toBeVisible()
				}

				for (const label of tc.expectedInvisibleLabel) {
					await expect.element(screen.getByText(label)).not.toBeVisible()
				}
			})
		}
	})
})
