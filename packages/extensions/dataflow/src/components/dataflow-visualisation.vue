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

	<button :disabled="!activeInputLNode || !activeOutputLNode" class="btn" @click="showModal">
		+
	</button>

	<DataflowCreationDialog
		v-if="activeInputLNode && activeOutputLNode"
		v-model:isOpen="isCreationDialogOpen"
		:sourceLNode="activeInputLNode"
		:destinationLNode="activeOutputLNode"
	/>
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import DataflowCreationDialog from './dataflow-creation.vue'
import { getEnrichedLNodesFromDB } from '../assets/useLNodeRecords'
import { onMounted, ref, watch } from 'vue'
import type { LNode } from '@/types/lnode'

const LNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)
const activeInputLNode = ref<LNode | null>(null)
const activeOutputLNode = ref<LNode | null>(null)
const isCreationDialogOpen = ref(false)

onMounted(async () => {
	LNodes.value = await getEnrichedLNodesFromDB()
	console.log('LNodes loaded:', LNodes.value)
})

watch(activeInputLNodeId, (newId) => {
	activeInputLNode.value = getActiveLNodeById(newId)
	console.log('Active Input LNode changed:', activeInputLNode.value)
})

watch(activeOutputLNodeId, (newId) => {
	activeOutputLNode.value = getActiveLNodeById(newId)
	console.log('Active Output LNode changed:', activeOutputLNode.value)
})

function getActiveLNodeById(id: string | null) {
	return LNodes.value.find((ln) => ln.id === id) ?? null
}

function showModal() {
	isCreationDialogOpen.value = true
}
</script>

<style scoped>
@import '@/assets/main.css';
.node-container {
}
</style>
