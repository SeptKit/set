import { describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { loadExtensions, type ExtensionDefinition } from './extension-loader'
import { useExtensionStore } from './extension-store'
import type { Extension } from './extension'
import { mockNextFetch } from '../x/test/fetch-mock'

describe('Extension Loader', () => {
	describe('Loading different kinds of contributions', () => {
		type TestCase = {
			desc: string
			extDefinition: ExtensionDefinition
			expectedExtension: Extension
		}

		const featureTests: TestCase[] = [
			{
				desc: 'a custom editor',
				extDefinition: {
					name: 'test-extension',
					description: 'an extension for testing',
					displayName: 'A Test Extension',
					version: '0.0.1-test',
					contributes: {
						customEditors: [
							{
								id: 'extension.test',
								displayName: 'A Test Custom Editor',
								icon: '',
								fileSelectors: ['SSD', 'ASD', 'SCD'],
								entryPoint: '/shell.js',
							},
						],
					},
				},
				expectedExtension: {
					id: 'test-extension',
					label: 'A Test Extension',
					version: '0.0.1-test',
					contributions: [
						{
							id: 'extension.test',
							label: 'A Test Custom Editor',
							type: 'widget',
							icon: '',
							location: 'mainArea',
							startFnUrl: 'http://localhost/shell.js',
						},
					],
				},
			},
			{
				desc: 'a menu item',
				extDefinition: {
					name: 'test-extension',
					description: 'an extension for testing',
					displayName: 'A Test Extension',
					version: '0.0.1-test',
					contributes: {
						menu: [
							{
								id: 'extension.test.menu',
								displayName: 'Main Item',
								entryPoint: 'menu.js',
							},
						],
					},
				},
				expectedExtension: {
					id: 'test-extension',
					label: 'A Test Extension',
					version: '0.0.1-test',
					contributions: [
						{
							id: 'extension.test.menu',
							label: 'Main Item',
							type: 'menu',
							icon: undefined,
							menuPath: [],
							actionFnUrl: 'http://localhost/menu.js',
						},
					],
				},
			},
		]

		featureTests.forEach(testFeature)

		function testFeature(tc: TestCase) {
			it(tc.desc, async () => {
				// Arrange
				setActivePinia(createPinia())
				mockNextFetch(tc.extDefinition)

				// Act
				await loadExtensions(['http://localhost'])

				// Assert
				const store = useExtensionStore()
				expect(store.extensions).toContainEqual(tc.expectedExtension)
			})
		}
	})
})
