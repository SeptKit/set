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

const store = useMainAreaWidgetStore()

const extensionList = [
	'https://septkit.github.io/extensions/structure/5/', // Structure Prod
	'https://septkit.github.io/extensions/dataflow/3/', // Dataflow Prod
	'http://localhost:55608/',
]

onMounted(() => loadExtensions(extensionList))

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
