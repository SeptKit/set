import { computed, ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { Extension, MenuContribution, WidgetContribution } from './extension'
import type { Optional } from '../x/types'

export const useExtensionStore = defineStore('extension', () => {
	const activeExtensionId = ref<string | null>(null)
	const extensions = ref<Extension[]>([])

	return {
		extensions,
		setExtensions,
		activeExtensionId,
		setActiveExtension,
		clearActiveExtension,
	}

	function setActiveExtension(id: string) {
		activeExtensionId.value = id
	}

	function clearActiveExtension() {
		activeExtensionId.value = null
	}

	function setExtensions(newExtensions: Extension[]) {
		extensions.value = newExtensions
	}
})

export type ExtensionStore = ReturnType<typeof useExtensionStore>

export const useMainAreaWidgetStore = defineStore('mainAreaWidgets', () => {
	const extensionStore = useExtensionStore()
	const activeWidget = ref<Optional<WidgetContribution>>()

	const widgets: ComputedRef<WidgetContribution[]> = computed(() => {
		return extensionStore.extensions
			.map((ext) =>
				ext.contributions
					.filter((cont) => cont.type === 'widget' && cont.location === 'mainArea')
					.map((c) => c as WidgetContribution),
			)
			.flat()
	})

	return {
		widgets,
		get activeWidget() {
			return activeWidget
		},
		activateWidget,
	}

	function activateWidget(widget: WidgetContribution) {
		activeWidget.value = widget
	}
})

export const useMenuContributionsStore = defineStore('menuContributionStore', () => {
	const _extensionStore = useExtensionStore()

	const _contributions = computed<MenuContribution[]>(() => {
		return _extensionStore.extensions
			.map((ext) =>
				ext.contributions.filter((cont) => cont.type === 'menu').map((c) => c as MenuContribution),
			)
			.flat()
	})

	return {
		contributions: _contributions,
	}
})

export const usePrimarySidebarWidgetStore = defineStore('primarySidebarWidgets', () => {
	const extensionStore = useExtensionStore()
	const activeWidget = ref<Optional<WidgetContribution>>()

	const widgets: ComputedRef<WidgetContribution[]> = computed(() => {
		return extensionStore.extensions
			.map((ext) =>
				ext.contributions
					.filter((cont) => cont.type === 'widget' && cont.location === 'primarySidebar')
					.map((c) => c as WidgetContribution),
			)
			.flat()
	})

	return {
		widgets,
		get activeWidget() {
			return activeWidget
		},
		activateWidget,
	}

	function activateWidget(widget: WidgetContribution) {
		activeWidget.value = widget
	}
})
