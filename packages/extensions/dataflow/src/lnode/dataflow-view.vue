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
import { ref } from 'vue'
import { type LNode } from '@/lnode/lnode'
import type { Connection } from './connection'
import DataflowVisualisation from './dataflow-visualisation.vue'
import DataflowCreationForm from './dataflow-creation-form.vue'

const props = defineProps<{
	lnodes: LNode[]
	connections: Connection[]
}>()

const sourceLNode = ref<LNode | null>(null)
const destinationLNode = ref<LNode | null>(null)
const isCreationDialogOpen = ref(false)

function onSourceLNodeChange(newLNodeId?: string) {
	sourceLNode.value = getActiveLNodeById(newLNodeId)
}

function onDestinationLNodeChange(newLNodeId?: string) {
	destinationLNode.value = getActiveLNodeById(newLNodeId)
}

function getActiveLNodeById(id: string | undefined) {
	return props.lnodes.find((ln) => ln.id === id) ?? null
}

function showModal() {
	isCreationDialogOpen.value = true
}
</script>

<!-- <style>
@import '@/assets/main.css';
</style> -->
