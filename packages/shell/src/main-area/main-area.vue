<template>
	<div class="main-area" name="main-area">
		<div class="editors">
			<EditorBar :widgets="store.widgets" @change="onWidgetChange" />
		</div>
		<div class="content">
			<WidgetSite :widget="store.activeWidget" rootId="main-area-widget-root" />
		</div>
	</div>
</template>

<script setup lang="ts">
import EditorBar from './editorbar/editorbar.vue'
import { useMainAreaWidgetStore } from '../extension/extension-store'
import WidgetSite from '../extension/widget/widget-site.vue'
import { onMounted } from 'vue'
import { loadExtensions } from '../extension/extension-loader'
import type { Optional } from '../x/types'
import { generateLocationAwareFileUrl } from '../x/url'

const store = useMainAreaWidgetStore()

onMounted(async () => {
	const extensions = await fetchExtensionList()
	loadExtensions(extensions)
})

async function fetchExtensionList(): Promise<string[]> {
	const url = generateLocationAwareFileUrl('/extensions.json', window.location.href)

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch extension list: ${response.statusText}, url:${url}`)
		}
		return await response.json()
	} catch (error) {
		console.error(error)
		return []
	}
}

function onWidgetChange(widgetId: Optional<string>) {
	const newActiveWidget = store.widgets.find((w) => w.id === widgetId)
	if (!newActiveWidget) {
		console.error({ msg: 'could not activate widget', widgetId })
		return
	}

	store.activateWidget(newActiveWidget)
}
</script>

<style scoped>
.editors {
	display: flex;
	align-items: center;
	gap: 1rem;
}
.main-area {
	height: 100%;
	display: grid;
	grid-template-rows: auto 1fr;
}

.content {
	position: relative;
	overflow: hidden;
}
</style>
