<template>
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">Dataflow Extension</h1>

		<DataflowView :sdks="sdks" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useLNodes, type LNodeSDK } from './lnode/use-lnodes'
import { openDatabase } from './x/database'
import { useConnections, type ConnectionSDK } from './lnode/use-connections'
import type Dexie from 'dexie'
import DataflowView from './lnode/dataflow-view.vue'

export type SDKs = {
	db: Dexie
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
		return
	}
	await initSDKs(newActiveFile)
}

async function initSDKs(newActiveFile: string) {
	if (sdks.value) {
		sdks.value.db.close()
	}

	const db = await openDatabase(newActiveFile)
	if (!db) throw new Error('database is not initialized.')

	sdks.value = {
		db: db,
		lnodeSDK: useLNodes(db),
		connectionSDK: useConnections(db),
	}
}
</script>

<style>
@import '@/assets/main.css';
</style>
