<template>
	<div class="join">
		<input
			v-for="widget in widgets"
			:key="widget.id"
			:aria-label="widget.label"
			v-model="activeWidget"
			:value="widget.id"
			@change="onChange"
			class="join-item btn"
			type="radio"
			name="options"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WidgetContribution } from '../../extension/extension'

const props = defineProps<{
	widgets: WidgetContribution[]
}>()

const emit = defineEmits<{
	change: [widgetId: string]
}>()

const activeWidget = ref<string>(props.widgets[0].id)

function onChange() {
	emit('change', activeWidget.value)
}
</script>
