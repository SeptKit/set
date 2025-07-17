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
import { computed } from 'vue'
import type { WidgetContribution } from '../extension/extension'
import EditorBar from './editorbar/editorbar.vue'
import { useMainAreaWidgetStore } from '../extension/extension-store'
import WidgetSite from '../extension/widget/widget-site.vue'

const store = useMainAreaWidgetStore()

function onWidgetChange(widgetId: string) {
	const newActiveWidget = store.widgets.find((w) => w.id === widgetId)
	if (!newActiveWidget) {
		console.error({ msg: 'could not activate widget', widgetId })
		return
	}

	store.setActiveWidget(newActiveWidget)
}
</script>

<style scoped>
.editors {
	display: flex;
	align-items: center;
	gap: 1rem;
}
</style>
