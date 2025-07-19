<template>
	<div class="root">
		<div class="editors">
			<span>Views</span>
			<EditorBar :widgets="store.widgets" @change="onWidgetChange" />
		</div>
		<div clas="content">
			<WidgetSite :widget="store.activeWidget" />
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

const store = useMainAreaWidgetStore()

const dummyExtensionLocationList = ['http://127.0.0.1:51003/', 'http://localhost:54944/']

onMounted(() => loadExtensions(dummyExtensionLocationList))

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
</style>
