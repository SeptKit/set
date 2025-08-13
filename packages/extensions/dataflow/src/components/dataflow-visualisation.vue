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
		<dataflow-node
			:lnodes="LNodes"
			type="output"
			:activeLNodeId="activeOutputLNodeId"
			@update:activeLNodeId="(val) => (activeOutputLNodeId = val)"
		/>
	</div>

	<DataflowCreation
		v-if="activeInputLNode && activeOutputLNode"
		:sourceLNode="activeInputLNode"
		:destinationLNode="activeOutputLNode"
	/>
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import DataflowCreation from './dataflow-creation.vue'
import { getEnrichedLNodesFromDB } from '../assets/useLNodeRecords'
import { onMounted, ref, watch } from 'vue'
import type { LNode } from '@/types/lnode'

const LNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)
const activeInputLNode = ref<LNode | null>(null)
const activeOutputLNode = ref<LNode | null>(null)

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

const sourceLNode: LNode = {
	id: '7aca07b3-2ade-4e72-b922-d0d9d5fd7dca',
	name: 'LN1',
	dataObjects: [
		{
			id: 'a0d283ff-a407-4787-9df6-0189d3570fd6',
			name: 'Signal1',
			dataAttributes: [
				{
					id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
					dataObjectId: 'a0d283ff-a407-4787-9df6-0189d3570fd6',
					name: 'Attribute1',
					fc: 'SP',
				},
				{
					id: 'c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f',
					dataObjectId: 'a0d283ff-a407-4787-9df6-0189d3570fd6',
					name: 'Attribute2',
					fc: 'SV',
				},
			],
			lNodeId: '7aca07b3-2ade-4e72-b922-d0d9d5fd7dca',
		},
		{
			id: 'b0d283ff-a407-4787-9df6-0189d3570fd6',
			name: 'Signal2',
			dataAttributes: [
				{
					id: 'd1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
					dataObjectId: 'a0d283ff-a407-4787-9df6-0189d3570fd6',
					name: 'Attribute1',
					fc: 'SV',
				},
			],
			lNodeId: '7aca07b3-2ade-4e72-b922-d0d9d5fd7dca',
		},
	],
}

const destinationLNode: LNode = {
	id: 'f1344fee-bb66-4525-bc18-6264c7220435',
	name: 'LN2',
	dataObjects: [],
}
</script>

<style scoped>
@reference "@/assets/main.css";
.node-container {
}
</style>
