<template>
	<div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
		<dataflow-node
			:lnodes="lNodes"
			type="input"
			:activeLNodeId="activeInputLNodeId"
			@update:activeLNodeId="onActiveInputLNodeChange"
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
		<dataflow-node
			:lnodes="lNodes"
			type="output"
			:activeLNodeId="activeOutputLNodeId"
			@update:activeLNodeId="onActiveOutputLNodeChange"
		/>
	</div>

	<button :disabled="!activeInputLNode || !activeOutputLNode" class="btn" @click="showModal">
		+
	</button>

	<DataflowCreationForm
		v-if="activeInputLNode && activeOutputLNode"
		v-model:isOpen="isCreationDialogOpen"
		:sourceLNode="activeInputLNode"
		:destinationLNode="activeOutputLNode"
	/>
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import DataflowCreationForm from './dataflow-creation-form.vue'
import { getEnrichedLNodesFromDB } from '../assets/use-lnode-records'
import { onMounted, ref } from 'vue'
import type { LNode } from '@/types/lnode'

const lNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)
const activeInputLNode = ref<LNode | null>(null)
const activeOutputLNode = ref<LNode | null>(null)
const isCreationDialogOpen = ref(false)

onMounted(async () => {
	lNodes.value = await getEnrichedLNodesFromDB()
})

function onActiveInputLNodeChange(newId: string | null) {
	activeInputLNodeId.value = newId
	activeInputLNode.value = getActiveLNodeById(newId)
	console.log('Active Input LNode changed:', activeInputLNode.value)
}

function onActiveOutputLNodeChange(newId: string | null) {
	activeOutputLNodeId.value = newId
	activeOutputLNode.value = getActiveLNodeById(newId)
	console.log('Active Output LNode changed:', activeOutputLNode.value)
}

function getActiveLNodeById(id: string | null) {
	return lNodes.value.find((ln) => ln.id === id) ?? null
}

function showModal() {
	isCreationDialogOpen.value = true
}
</script>

<style scoped>
@import '@/assets/main.css';
</style>
