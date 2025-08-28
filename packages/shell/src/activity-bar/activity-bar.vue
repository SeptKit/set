<template>
	<div class="activity-bar">
		<button
			v-for="widget in store.widgets"
			:key="widget.id"
			class="btn btn-ghost"
			:class="{ 'btn-active': isWidgetActive(widget) }"
			:title="widget.label"
			@click="activateWidget(widget)"
		>
			{{ getFirstLetter(widget) }}
		</button>
	</div>
</template>

<script setup lang="ts">
import type { WidgetContribution } from '../extension/extension'
import { usePrimarySidebarWidgetStore } from '../extension/extension-store'

const store = usePrimarySidebarWidgetStore()

function getFirstLetter(widget: WidgetContribution): string {
	return widget.label.charAt(0).toUpperCase()
}
function isWidgetActive(widget: WidgetContribution): boolean {
	return store.activeWidget?.id === widget.id
}

function activateWidget(widget: WidgetContribution) {
	if (store.activeWidget?.id === widget.id) {
		return
	}
	store.activateWidget(widget)
}
</script>

<style scoped>
.activity-bar {
	flex-direction: column;
}

.activity-bar-item {
	width: 10px;
}
</style>
