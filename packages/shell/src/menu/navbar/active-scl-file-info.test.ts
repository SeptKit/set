import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { createPinia } from 'pinia'
import { useFileStore } from '@/data-management/data-management.store'
import ActiveSCLfileInfo from './active-scl-file-info.vue'
import { nextTick } from 'vue'

describe('ActiveFile.vue', () => {
	it('shows "No active file" when there is no active file, and "Active File: projektX" if a file is set', async () => {
		const pinia = createPinia()
		const screen = render(ActiveSCLfileInfo, {
			global: {
				plugins: [pinia],
			},
		})
		const fileStore = useFileStore()
		fileStore.currentActiveFileDatabaseName = ''
		expect(screen.getByText('No active file')).toBeInTheDocument()
		fileStore.currentActiveFileDatabaseName = 'projektX'
		await nextTick
		expect(screen.getByText('Active file: projektX')).toBeInTheDocument()
	})
})
