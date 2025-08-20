<template>
	<div class="visualisation-row">
		<LNodeElement
			:lnodes="lNodes"
			type="input"
			:activeLNodeId="activeInputLNodeId"
			@change="onActiveInputLNodeIdChange"
		/>
		<div class="visualisation-connections">- Connections -</div>
		<LNodeElement
			:lnodes="lNodes"
			type="output"
			:activeLNodeId="activeOutputLNodeId"
			@change="onActiveOutputLNodeIdChange"
		/>
	</div>
</template>

<script setup lang="ts">
import LNodeElement from './lnode-element.vue'
import type { LNodeSDK } from './lnode-database'
import { onMounted, ref, watch } from 'vue'
import type { LNode } from '@/lnode/lnode'

const props = defineProps<{
	lnodeSDK: LNodeSDK | undefined
}>()

const lNodes = ref<LNode[]>([])

const activeInputLNodeId = ref<string | undefined>()
const activeOutputLNodeId = ref<string | undefined>()

onMounted(initLnode)
watch(() => props.lnodeSDK, initLnode)

async function initLnode() {
	if (!props.lnodeSDK) {
		return
	}
	lNodes.value = await props.lnodeSDK.findAllEnrichedLNodesFromDB()
}

function onActiveInputLNodeIdChange(newLNodeId?: string) {
	activeInputLNodeId.value = newLNodeId
}
function onActiveOutputLNodeIdChange(newLNodeId?: string) {
	activeOutputLNodeId.value = newLNodeId
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
