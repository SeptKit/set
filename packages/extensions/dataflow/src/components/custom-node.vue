<template>
	<div :style="[nodeStyle, style]" class="custom-node">
		<!-- Eingang (target) links -->
		<Handle type="target" :position="Position.Left" />
		<!-- Ausgang (source) rechts -->
		<Handle type="source" :position="Position.Right" />
		<template v-if="data.isContainer">
			<div class="node-container-label">{{ data.label }}</div>
			<slot />
		</template>
		<div v-else>{{ data.label }}</div>
	</div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps(['data', 'style']) //hier style als prop
const nodeStyle = computed(() =>
	props.data.isContainer
		? {
				background: '#e3f2fd',
				border: '2px solid #1976d2',
				borderRadius: '12px',
				padding: '18px 12px 12px 12px',
				minWidth: '220px',
				boxShadow: '0 1px 10px #1976d233',
				position: 'relative',
			}
		: {
				background: '#fff',
				border: '1.5px solid #1976d2',
				borderRadius: '6px',
				padding: '4px 12px',
				minWidth: '80px',
				color: '#222',
				fontWeight: '500',
				boxShadow: '0 1px 5px #1976d233',
			},
)
</script>

<style scoped>
.node-container-label {
	font-weight: bold;
	color: #1976d2;
	margin-bottom: 10px;
	font-size: 1.08em;
}
</style>
