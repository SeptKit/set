<!-- dataflow-visualisation.vue-->

<template>
	<div
		class="node-container"
		style="display: flex; flex-direction: row; align-items: center; justify-content: center"
	>
		<dataflow-node
			:lnodes="LNodes"
			type="input"
			:activeLNodeId="activeInputLNodeId"
			@update:activeLNodeId="(val) => (activeInputLNodeId = val)"
		/>
		<div
			style="
				width: 200px;
				height: 200px;
				display: flex;
				align-items: center;
				justify-content: center;
			"
		>
			- Connections -
		</div>
		<dataflow-node :lnodes="LNodes" type="output" v-model:activeLNodeId="activeOutputLNodeId" />
	</div>
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import { getEnrichedLNodesFromDB } from '../assets/useLNodeRecords'
import { onMounted, ref } from 'vue'
import type { LNode } from '@/types/lnode'

const LNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)

onMounted(async () => {
	LNodes.value = await getEnrichedLNodesFromDB()
	console.log('LNodes loaded:', LNodes.value)
})

// get active input and output LNodes
function getActiveLNodes() {
	const activeInputLNode = getActiveLNodeById(activeInputLNodeId.value)
	const activeOutputLNode = getActiveLNodeById(activeOutputLNodeId.value)
	console.log('Active Input LNode:', activeInputLNode)
	console.log('Active Output LNode:', activeOutputLNode)
	return { activeInputLNode, activeOutputLNode }
}
// helper function to get active LNode by ID
function getActiveLNodeById(id: string | null) {
	return LNodes.value.find((ln) => ln.id === id) ?? null
}
</script>

<style scoped>
@reference "@/assets/main.css";
.node-container {
}
</style>
