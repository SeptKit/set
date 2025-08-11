<template>
	<div
		class="node-container"
		style="display: flex; flex-direction: row; align-items: center; justify-content: center"
	>
		<dataflowNode type="source" />

		<!-- connection Component here? -->
		<div>- Connections -</div>

		<dataflowNode type="receiver" />
	</div>

	<!-- "Plus-button" component with modal for new conncetion here? -->
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'

const props = defineProps<{
	api: { [key: string]: any }
}>()
</script>

<style scoped>
@reference "@/assets/main.css";

.node-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}
</style>
