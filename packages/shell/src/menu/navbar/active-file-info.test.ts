import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import { useFileStore } from '@/data-management/data-management.store'
import activeFileInfo from './active-file-info.vue'

describe('ActiveFile.vue', () => {
	it('shows "No active file" when there is no active file, and "Active File: projektX" if a file is set', async () => {
		setActivePinia(createPinia())
		const fileStore = useFileStore()
		fileStore.currentActiveFileDatabaseName = ''
		const wrapper = shallowMount(activeFileInfo, {
			global: {
				plugins: [createPinia()],
			},
		})
		expect(wrapper.text()).toMatch(/No active file/)

		fileStore.currentActiveFileDatabaseName = 'projektX'
		// wait for updated DB file name
		await wrapper.vm.$nextTick()
		expect(wrapper.text()).toMatch(/Active File: projektX/)
	})
})
