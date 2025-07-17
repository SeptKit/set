<template>
	<div v-if="widget">loading: {{ widget.label }}</div>
</template>

<script setup lang="ts">
import type { Optional } from '../../x/types'
import type { WidgetContribution } from '../extension'

const props = defineProps<{
	widget: Optional<WidgetContribution>
}>()
</script>

<style scoped></style>
