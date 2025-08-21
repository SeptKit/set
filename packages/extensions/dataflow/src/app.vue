<template>
	<div>
		<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">Dataflow Extension</h1>
		<div class="dataflow-app-center">
			<DataflowVisualisation :lnodeSDK="lnodeSDK" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DataflowVisualisation from '@/lnode/dataflow-visualisation.vue'
import { createLNodeSDK, type LNodeSDK } from '@/lnode/lnode-database'
import { openDatabase } from '@/x/database'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let lnodeSDK = ref<LNodeSDK | undefined>()

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
		throw new Error('incorrecr active file name: ' + newActiveFile)
	}
	await initSDK(newActiveFile)
}

async function initWithCurrentActiveFile() {
	const newActiveFile = localStorage.getItem('currentActiveFileDatabaseName')
	if (!newActiveFile) {
		throw new Error('incorrecr active file name: ' + newActiveFile)
	}
	await initSDK(newActiveFile)
}

async function initSDK(newActiveFile: string) {
	if (lnodeSDK.value) {
		lnodeSDK.value.close()
	}

	const db = await openDatabase(newActiveFile)
	if (!db) throw new Error('database is not initialized.')

	lnodeSDK.value = createLNodeSDK(db)
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
