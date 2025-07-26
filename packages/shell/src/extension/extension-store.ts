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
		clearActivePluginSrc,
	}

	function setActiveExtension(id: string) {
		activeExtensionId.value = id
	}

	function clearActivePluginSrc() {
		activeExtensionId.value = null
	}

	function setExtensions(newExtensions: Extension[]) {
		extensions.value = newExtensions
	}
})

export type ExtensionStore = ReturnType<typeof useExtensionStore>

export const useMainAreaWidgetStore = defineStore('mainAreaExtensions', () => {
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
	const extensionStore = useExtensionStore()

	const contributions: ComputedRef<MenuContribution[]> = computed(() => {
		return extensionStore.extensions
			.map((ext) =>
				ext.contributions.filter((cont) => cont.type === 'menu').map((c) => c as MenuContribution),
			)
			.flat()
	})

	return {
		contributions,
	}
})
