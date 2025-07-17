import { computed, ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { Extension, WidgetContribution } from './extension'
import type { Optional } from '../x/types'

export const useExtensionStore = defineStore('extension', () => {
	const activeExtensionId = ref<string | null>(null)
	const extensions = ref<Extension[]>(dummyExtensionList)

	return {
		extensions,
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
		setActiveWidget,
	}

	function setActiveWidget(widget: WidgetContribution) {
		activeWidget.value = widget
	}
})

// 'Dataflow', 'SLD', 'Communication'
const dummyExtensionList: Extension[] = [
	{
		id: 'sprinteins.dataflow',
		label: 'Dataflow',
		contributions: [
			{
				id: 'sprinteins.dataflow.dataflow',
				type: 'widget',
				label: 'Dataflow',
				icon: '_',
				location: 'mainArea',
				start: () => {},
			},
		],
	},
	{
		id: 'sprinteins.sld',
		label: 'SLD',
		contributions: [
			{
				id: 'sprinteins.sld.sld',
				type: 'widget',
				label: 'SLD',
				icon: '_',
				location: 'mainArea',
				start: () => {},
			},
		],
	},
	{
		id: 'sprinteins.communication',
		label: 'Communication',
		contributions: [
			{
				id: 'sprinteins.communication.communication',
				type: 'widget',
				label: 'Communication',
				icon: '_',
				location: 'mainArea',
				start: () => {},
			},
		],
	},
]
