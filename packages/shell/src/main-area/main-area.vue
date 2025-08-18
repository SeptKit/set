<template>
	<div class="root" name="main-area">
		<div class="editors">
			<!-- <span>Views</span> -->
			<EditorBar :widgets="store.widgets" @change="onWidgetChange" />
		</div>
		<div class="content">
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

const dummyExtensionLocationList = [
	// 'https://septkit.github.io/extensions/structure/2/', // Structure Prod
	'http://localhost:54945/', //Structure DEV
	// 'http://127.0.0.1:51003/',
	// 'http://localhost:54944/',
	// 'http://localhost:54945/', //__TEMPLATE__
	// 'http://localhost:54945/',
]

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
.root {
	height: 100%;
	display: grid;
	grid-template-rows: auto 1fr;
}

.content {
	position: relative;
	overflow: hidden;
}
</style>
