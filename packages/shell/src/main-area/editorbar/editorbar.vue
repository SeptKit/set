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
import type { Optional } from '../../x/types'

const props = defineProps<{
	widgets: WidgetContribution[]
}>()

const emit = defineEmits<{
	change: [widgetId: Optional<string>]
}>()

const activeWidget = ref<Optional<string>>()

function onChange() {
	emit('change', activeWidget.value)
}
</script>
