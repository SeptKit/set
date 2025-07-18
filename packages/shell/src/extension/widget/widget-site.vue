<template>
	<div>
		<div v-if="widget">loading: {{ widget.label }} {{ widget.startFnUrl }}</div>
		<div ref="widget-root" id="main-area-widget-root">&nbsp;</div>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import type { Optional } from '../../x/types'
import type { WidgetContribution } from '../extension'
import { fetchWidgetStartFn } from '../extension-loader'
import { useExtensionAPI } from '../extension-api'

const props = defineProps<{
	widget: Optional<WidgetContribution>
}>()

const api = useExtensionAPI()
const widgetRoot = useTemplateRef<HTMLDivElement>('widget-root')
let previousETag: string = ''

watch(() => props.widget, watchPluginChange)

async function watchPluginChange() {
	await reloadPluginIfNeeded()
	setTimeout(watchPluginChange, 2_000)
}

async function reloadPluginIfNeeded() {
	if (!props.widget) {
		return
	}

	try {
		const url = addCachBusterToURL(props.widget.startFnUrl)
		const response = await fetch(url, { method: 'HEAD' })
		const currentETag = response.headers.get('ETag') || response.headers.get('Last-Modified')
		console.debug({ msg: 'checking ETAG', previousETag, currentETag })
		if (!currentETag || currentETag === previousETag) {
			return
		}

		previousETag = currentETag
		// const url = addCachBusterToURL(props.widget.startFnUrl)
		console.debug({ msg: 'reloading plugin', startFnUrl: url })
		loadAndStartPlugin(url)
	} catch (error) {
		console.error('Failed to reload plugin:', error)
	}
}

async function loadAndStartPlugin(startFnUrl?: string) {
	if (!startFnUrl) {
		console.debug({ msg: 'no startFnUrl yet' })
		return
	}

	const startFn = await fetchWidgetStartFn(startFnUrl)
	console.debug({ msg: 'fetched Start FN', startFn })
	if (!startFn) {
		return
	}
	if (!widgetRoot.value) {
		console.error({ msg: 'could not find widget root', widgetRoot })
		return
	}
	widgetRoot.value.innerHTML = ''
	startFn('main-area-widget-root', api)
}

function addCachBusterToURL(url: string): string {
	const urlObj = new URL(url)
	urlObj.searchParams.set('t', Date.now().toString())
	return urlObj.toString()
}
</script>

<style scoped></style>
