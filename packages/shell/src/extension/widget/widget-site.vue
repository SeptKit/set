<template>
	<div>
		<div>
			<div v-if="widget">loading: {{ widget.label }} {{ widget.startFnUrl }}</div>
			<div ref="widget-root" id="main-area-widget-root">&nbsp;</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
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
	setTimeout(watchPluginChange, 3_000)
}

async function reloadPluginIfNeeded() {
	if (!props.widget) {
		return
	}

	try {
		const response = await fetch(props.widget.startFnUrl, { method: 'HEAD' })
		const currentETag = response.headers.get('ETag') || response.headers.get('Last-Modified')

		if (!currentETag || currentETag === previousETag) {
			return
		}

		previousETag = currentETag

		// Note: we add a cach buster to the url everytime we need to load the modules
		// because the browsers cache so hard that they request them from server or local disk
		//
		// TODO: We need to take this into consideration when we set up service
		// workers for offline usage
		//
		// From MDN:
		// > This aggressive caching ensures that a piece of JavaScript code
		// > is never executed more than once, even if it is imported multiple times.
		// > Future imports don't even result in HTTP requests or disk access.
		// > If you do need to re-import and re-evaluate a module without restarting
		// > the entire JavaScript environment, one possible trick is to use a
		// > unique query parameter in the module specifier.
		// > This works in non-browser runtimes that support URL specifiers too.
		//
		// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object
		const url = addCachBusterToURL(props.widget.startFnUrl)
		loadAndStartExtension(url)
	} catch (error) {
		console.error('Failed to reload plugin:', error)
	}
}

async function loadAndStartExtension(startFnUrl: Optional<string>) {
	if (!startFnUrl) {
		console.info({ msg: 'no startFnUrl yet' })
		return
	}

	const startFn = await fetchWidgetStartFn(startFnUrl)
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
