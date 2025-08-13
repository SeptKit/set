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
	<!-- "Plus-button" component with modal for new connection here? -->
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
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
</script>

<style scoped>
@reference "@/assets/main.css";
.node-container {
}
</style>
