<template>
	<div>
		<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">Dataflow Extension</h1>
		<div class="dataflow-app-center">
			<DataflowVisualisation :sdks="sdks" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DataflowVisualisation from '@/lnode/dataflow-visualisation.vue'
import { useLNodes, type LNodeSDK } from '@/lnode/use-lnodes'
import { useConnections, type ConnectionSDK } from './lnode/use-connections'
import Dexie from 'dexie'

export type SDKs = {
	lnodeSDK: LNodeSDK
	connectionSDK: ConnectionSDK
}

const props = defineProps<{
	api: { [key: string]: any }
}>()

let sdks = ref<SDKs | undefined>()

onMounted(() => {
	window.addEventListener('storage', onActiveFileChange)
	initWithCurrentActiveFile()
})
onUnmounted(() => {
	window.removeEventListener('storage', onActiveFileChange)
})

async function onActiveFileChange(event: StorageEvent) {
	if (event.key !== 'currentActiveFileDatabaseName') {
		return
	}

	const newActiveFile = event.newValue
	if (!newActiveFile) {
		throw new Error('incorrect active file name: ' + newActiveFile)
	}

	await initSDKs(newActiveFile)
}

async function initWithCurrentActiveFile() {
	const newActiveFile = localStorage.getItem('currentActiveFileDatabaseName')
	if (!newActiveFile) {
		throw new Error('incorrect active file name: ' + newActiveFile)
	}
	await initSDKs(newActiveFile)
}

async function initSDKs(newActiveFile: string) {
	const db = new Dexie(newActiveFile)
	if (!db) throw new Error('database is not initialized.')

	sdks.value = {
		lnodeSDK: useLNodes(db),
		connectionSDK: useConnections(db),
	}
}
</script>

<style scoped>
/*
	We import it here and not on the top so it is scoped and does not affect
	the rest of the ui
*/
@import '@/assets/main.css';

.dataflow-app-center {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
