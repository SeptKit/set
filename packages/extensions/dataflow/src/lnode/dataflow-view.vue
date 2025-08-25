<template>
	<div class="flex flex-col items-center justify-center w-full">
		<DataflowVisualisation
			:connections="connections"
			:lnodes="lnodes"
			@sourceLNodeChange="onSourceLNodeChange"
			@destinationLNodeChange="onDestinationLNodeChange"
		/>

		<button
			:disabled="!sourceLNode || !destinationLNode"
			class="btn bg-(--color-chart-3) border-none text-white disabled:text-(--color-ocean-gray-300)"
			@click="showModal"
		>
			+
		</button>

		<DataflowCreationForm
			v-if="sourceLNode && destinationLNode"
			v-model:isOpen="isCreationDialogOpen"
			:sourceLNode="sourceLNode"
			:destinationLNode="destinationLNode"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { type LNode } from './lnode'
import type { Connection } from './connection'
import DataflowVisualisation from './dataflow-visualisation.vue'
import DataflowCreationForm from './dataflow-creation-form.vue'
import type { SDKs } from '@/app.vue'

const props = defineProps<{
	sdks: SDKs | undefined
}>()

const sourceLNode = ref<LNode | null>(null)
const destinationLNode = ref<LNode | null>(null)
const isCreationDialogOpen = ref(false)

const lnodes = ref<LNode[]>([])
const connections = ref<Connection[]>([])

watch(
	() => props.sdks,
	() => {
		initLnodes()
		initConnections()
	},
	{ immediate: true },
)

async function initLnodes() {
	if (!props.sdks) {
		return
	}
	lnodes.value = await props.sdks.lnodeSDK.findAllEnrichedFromDB()
}

async function initConnections() {
	if (!props.sdks) {
		return
	}
	connections.value = await props.sdks.connectionSDK.findAllExistingFromDB()
}

function onSourceLNodeChange(newLNodeId?: string) {
	sourceLNode.value = getActiveLNodeById(newLNodeId)
}

function onDestinationLNodeChange(newLNodeId?: string) {
	destinationLNode.value = getActiveLNodeById(newLNodeId)
}

function getActiveLNodeById(id: string | undefined) {
	return lnodes.value.find((ln) => ln.id === id) ?? null
}

function showModal() {
	isCreationDialogOpen.value = true
}
</script>
