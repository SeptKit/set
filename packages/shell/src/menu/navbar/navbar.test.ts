import { expect, describe, it, vi } from 'vitest'
import {} from '@vitest/browser/context'
import { render } from 'vitest-browser-vue'
import NavBar from './navbar.vue'
import type { NavBarItem } from './navbar-item'

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
					},
				})

				for (const label of tc.expectedLabels) {
					await expect.element(screen.getByText(label)).toBeInTheDocument()
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
				desc: 'without clickin submenus are hidden',
				items: [{ id: 'file.open', label: 'Open', path: ['File'], action: noop }],
				clickOnLabels: [],
				expectedVisibleLabels: ['File'],
				expectedInvisibleLabel: ['Open'],
			},
			{
				desc: 'if clicked on its parent sub menut items are revealed',
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
				expectedVisibleLabels: ['File', 'Function'],
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
				// Arrange
				const screen = render(NavBar, {
					props: {
						items: tc.items,
					},
				})

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

	describe('Item Actions', () => {
		it('runs action on click', async () => {
			// Arrange
			const action = vi.fn()
			const items = [{ id: 'file.open', label: 'Open', path: ['File'], action }]
			const screen = render(NavBar, {
				props: {
					items,
				},
			})

			// Act
			await screen.getByText('File').click()
			await screen.getByText('Open').click()

			// Assert
			expect(action).toHaveBeenCalled()
		})
	})
})

function noop() {}
