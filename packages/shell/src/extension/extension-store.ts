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

export const useMainAreaWidgetStore = makeWidgetStore('mainArea')
export const usePrimarySidebarWidgetStore = makeWidgetStore('primarySidebar')
export const useSecondarySidebarWidgetStore = makeWidgetStore('secondarySidebar')
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

function makeWidgetStore(location: WidgetContribution['location']) {
	return defineStore(`${location}Store`, () => {
		const _extensionStore = useExtensionStore()
		const _activeWidget = ref<Optional<WidgetContribution>>()

		const widgets: ComputedRef<WidgetContribution[]> = computed(() => {
			return _extensionStore.extensions
				.map((ext) =>
					ext.contributions
						.filter((cont) => cont.type === 'widget' && cont.location === location)
						.map((c) => c as WidgetContribution),
				)
				.flat()
		})

		return {
			widgets,
			get activeWidget() {
				return _activeWidget
			},
			activateWidget,
		}

		function activateWidget(widget: WidgetContribution) {
			_activeWidget.value = widget
		}
	})
}
