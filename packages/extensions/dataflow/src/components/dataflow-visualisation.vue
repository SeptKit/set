<!-- dataflow-visualisation.vue-->

<template>
	<div
		class="node-container"
		style="display: flex; flex-direction: row; align-items: center; justify-content: center"
	>
		<dataflow-node
			:lnodes="testLNodes"
			type="input"
			@update:activeLNode="onActiveInputNodeChange"
		/>

		<!-- Connection Component here? -->
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
			:lnodes="testLNodes"
			type="output"
			@update:activeLNode="onActiveOutputNodeChange"
		/>
	</div>

	<DataflowCreation :sourceLNode="sourceLNode" :destinationLNode="destinationLNode" />

	<!-- "Plus-button" component with modal for new conncetion here? -->
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import DataflowCreation from './dataflow-creation.vue'
import testLNodes from '../assets/lnodeTestData' // Test data for logical nodes
import type { LNodeObject } from '../assets/lnode.types'
import { getEnrichedLNodesFromDB } from '../assets/useLNodeRecords'
import { onMounted, ref } from 'vue'
import type { LNode } from '@/types/lnode'

const props = defineProps<{
	api: { [key: string]: any }
}>()

const LNodes = ref<LNode[]>([])

onMounted(async () => {
	LNodes.value = await getEnrichedLNodesFromDB()
	console.log('Enriched LNodes:', LNodes.value)
})

// active nodes for input and output
const activeInputNode = ref<LNodeObject | null>(null)
const activeOutputNode = ref<LNodeObject | null>(null)

function onActiveInputNodeChange(node: LNodeObject | null) {
	activeInputNode.value = node
	console.log('activeInputNode:', activeInputNode.value)
}

function onActiveOutputNodeChange(node: LNodeObject | null) {
	activeOutputNode.value = node
	console.log('activeOutputNode:', activeOutputNode.value)
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
