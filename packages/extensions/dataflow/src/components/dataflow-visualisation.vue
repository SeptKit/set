<template>
	<div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
		<dataflow-node
			:lnodes="lNodes"
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
		<dataflow-node :lnodes="lNodes" type="output" v-model:activeLNodeId="activeOutputLNodeId" />
	</div>
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import { getEnrichedLNodesFromDB } from '../assets/use-lnode-records'
import { onMounted, ref } from 'vue'
import type { LNode } from '@/types/lnode'

const lNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)

onMounted(async () => {
	lNodes.value = await getEnrichedLNodesFromDB()
})
</script>

<style scoped>
@import '@/assets/main.css';
</style>
