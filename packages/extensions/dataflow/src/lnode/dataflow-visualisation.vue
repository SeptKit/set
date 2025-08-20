<template>
	<div class="visualisation-row">
		<DataflowNode :lnodes="lNodes" type="input" v-model:activeLNodeId="activeInputLNodeId" />
		<div class="visualisation-connections">- Connections -</div>
		<DataflowNode :lnodes="lNodes" type="output" v-model:activeLNodeId="activeOutputLNodeId" />
	</div>
</template>

<script setup lang="ts">
import DataflowNode from './lnode-element.vue'
import type { LNodeSDK } from './lnode-database'
import { onMounted, ref, watch } from 'vue'
import type { LNode } from '@/lnode/lnode'

const props = defineProps<{
	lnodeSDK: LNodeSDK | undefined
}>()

const lNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | null>(null)
const activeOutputLNodeId = ref<string | null>(null)

onMounted(initLnode)
watch(() => props.lnodeSDK, initLnode)

async function initLnode() {
	console.debug({ level: 'debug', msg: 'init lnode', sdk: props.lnodeSDK })
	if (!props.lnodeSDK) {
		return
	}
	lNodes.value = await props.lnodeSDK.findAllEnrichedLNodesFromDB()
}
</script>

<style scoped>
@import '@/assets/main.css';

.visualisation-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.visualisation-connections {
	width: 200px;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
