<template>
	<div>
		<div v-if="widget">loading: {{ widget.label }} {{ widget.startFnUrl }}</div>
		<div id="main-area-widget-root">&nbsp;</div>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { Optional } from '../../x/types'
import type { WidgetContribution } from '../extension'
import { fetchWidgetStartFn } from '../extension-loader'
import { useExtensionAPI } from '../extension-api'

const props = defineProps<{
	widget: Optional<WidgetContribution>
}>()

const api = useExtensionAPI()

watch(
	() => props.widget,
	async () => {
		if (!props.widget?.startFnUrl) {
			console.debug({ msg: 'no startFnUrl yet' })
			return
		}

		const startFn = await fetchWidgetStartFn(props.widget?.startFnUrl)
		console.debug({ msg: 'fetched Start FN', startFn })
		if (!startFn) {
			return
		}
		startFn('main-area-widget-root', api)
	},
)
</script>

<style scoped></style>
