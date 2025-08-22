<template>
	<div class="flex flex-col items-center justify-center">
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
		<button :disabled="!activeInputLNode || !activeOutputLNode" class="btn" @click="showModal">
			+
		</button>

		<DataflowCreationForm
			v-if="activeInputLNode && activeOutputLNode"
			v-model:isOpen="isCreationDialogOpen"
			:sourceLNode="activeInputLNode"
			:destinationLNode="activeOutputLNode"
		/>
	</div>
</template>

<script setup lang="ts">
import LNodeElement from './lnode-element.vue'
import { ref, watch } from 'vue'
import type { LNode } from '@/lnode/lnode'
import DataflowCreationForm from './dataflow-creation-form.vue'
import type { Connection } from './connection'
import type { SDKs } from '../app.vue'

const props = defineProps<{
	sdks: SDKs | undefined
}>()

const lNodes = ref<LNode[]>([])
const connections = ref<Connection[]>([])

const activeInputLNodeId = ref<string | undefined>()
const activeOutputLNodeId = ref<string | undefined>()
const activeInputLNode = ref<LNode | null>(null)
const activeOutputLNode = ref<LNode | null>(null)
const isCreationDialogOpen = ref(false)

watch(
	() => props.sdks,
	async () => {
		await initLnodes()
		await initConnections()
	},
	{ immediate: true },
)
async function initLnodes() {
	if (!props.sdks) {
		return
	}
	lNodes.value = await props.sdks.lnodeSDK.findAllEnrichedFromDB()
}

async function initConnections() {
	if (!props.sdks) {
		return
	}
	connections.value = await props.sdks.connectionSDK.findAllExistingFromDB()
}

function onActiveInputLNodeIdChange(newLNodeId?: string) {
	activeInputLNodeId.value = newLNodeId
	activeInputLNode.value = getActiveLNodeById(newLNodeId)
}
function onActiveOutputLNodeIdChange(newLNodeId?: string) {
	activeOutputLNodeId.value = newLNodeId
	activeOutputLNode.value = getActiveLNodeById(newLNodeId)
}

function getActiveLNodeById(id: string | undefined) {
	return lNodes.value.find((ln) => ln.id === id) ?? null
}

function showModal() {
	isCreationDialogOpen.value = true
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
