import { expect, describe, it, vi } from 'vitest'
import {} from '@vitest/browser/context'
import { render } from 'vitest-browser-vue'
import NavBar from './navbar.vue'
import type { NavBarItem } from './navbar-item'
import { createPinia } from 'pinia'

function noop() {}

describe('NavBar', () => {
	describe('Rendering Elements', () => {
		type TestCase = {
			desc: string
			items: NavBarItem[]
			expectedLabels: string[]
		}
		const tests: TestCase[] = [
			{
				desc: 'a main menu item is one without any path',
				items: [{ id: 'file', label: 'File', path: [], action: noop }],
				expectedLabels: ['File'],
			},
			{
				desc: 'A sub menu item can be found',
				items: [{ id: 'file.open', label: 'Open', path: ['File'], action: noop }],
				expectedLabels: ['File', 'Open'],
			},
		]
		tests.forEach(testRendering)
		function testRendering(tc: TestCase) {
			it(tc.desc, async () => {
				const screen = render(NavBar, {
					props: {
						items: tc.items,
						activeFileName: '',
					},
					global: { plugins: [createPinia()] },
				})
				for (const label of tc.expectedLabels) {
					await expect.element(screen.getByText(label, { exact: true })).toBeInTheDocument()
				}
			})
		}
	})
	describe('Opening Sub Menus', () => {
		type TestCase = {
			desc: string
			items: NavBarItem[]
			clickOnLabels: string[]
			expectedVisibleLabels: string[]
			expectedInvisibleLabel: string[]
		}
		const tests: TestCase[] = [
			{
				desc: 'without clicking submenus are hidden',
				items: [{ id: 'file.open', label: 'Open', path: ['File'], action: noop }],
				clickOnLabels: [],
				expectedVisibleLabels: ['File'],
				expectedInvisibleLabel: ['Open'],
			},
			{
				desc: 'if clicked on its parent sub menu items are revealed',
				items: [{ id: 'file.open', label: 'Open', path: ['File'], action: noop }],
				clickOnLabels: ['File'],
				expectedVisibleLabels: ['File', 'Open'],
				expectedInvisibleLabel: [],
			},
			{
				desc: 'clicking on another main item closes other sub menus',
				items: [
					{ id: 'file.open', label: 'Open', path: ['File'], action: noop },
					{ id: 'import.function', label: 'Function', path: ['Import'], action: noop },
				],
				clickOnLabels: ['File', 'Import'],
				expectedVisibleLabels: ['File', 'Import', 'Function'],
				expectedInvisibleLabel: ['Open'],
			},
			{
				desc: 'Opening a submenu then clicking on a sub item closes the menu',
				items: [{ id: 'file.open', label: 'Open', path: ['File'], action: noop }],
				clickOnLabels: ['File', 'Open'],
				expectedVisibleLabels: ['File'],
				expectedInvisibleLabel: ['Open'],
			},
		]
		tests.forEach(testRendering)
		function testRendering(tc: TestCase) {
			it(tc.desc, async () => {
				const screen = render(NavBar, {
					props: {
						items: tc.items,
						activeFileName: '',
					},
					global: { plugins: [createPinia()] },
				})
				for (const label of tc.clickOnLabels) {
					await screen.getByText(label, { exact: true }).click()
				}
				for (const label of tc.expectedVisibleLabels) {
					await expect.element(screen.getByText(label, { exact: true })).toBeVisible()
				}
				for (const label of tc.expectedInvisibleLabel) {
					await expect.element(screen.getByText(label, { exact: true })).not.toBeVisible()
				}
			})
		}
	})
	describe('Item Actions', () => {
		it('runs action on click', async () => {
			const action = vi.fn()
			const items = [{ id: 'file.open', label: 'Open', path: ['File'], action }]
			const screen = render(NavBar, {
				props: {
					items,
					activeFileName: '',
				},
				global: { plugins: [createPinia()] },
			})
			await screen.getByText('File', { exact: true }).click()
			await screen.getByText('Open', { exact: true }).click()
			expect(action).toHaveBeenCalled()
		})
	})
})
