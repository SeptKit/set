<template>
	<div>
		<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">Dataflow Extension</h1>
		<div class="flex flex-col items-center justify-center">
			<DataflowVisualisation :lnodeSDK="lnodeSDK" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DataflowVisualisation from './lnode/dataflow-visualisation.vue'
import { createLNodeSDK, type LNodeSDK } from './lnode/lnode-database'
import { openDatabase } from './x/database'
import { useStorage } from '@vueuse/core'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let fileName = ref('')
let unsubscribe = () => {}

onMounted(() => {
	window.addEventListener('storage', onActiveFileChange)
	initWithCurrentActiveFile()
})
onUnmounted(() => {
	window.removeEventListener('storage', onActiveFileChange)
})

let lnodeSDK = ref<LNodeSDK | undefined>()
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

// onMounted(() => {
// 	unsubscribe = props.api?.activeFileName.subscribe((newFile: string, oldFile: any) => {
// 		fileName.value = newFile
// 	})
// })

onUnmounted(() => {
	unsubscribe()
})
</script>

<style scoped>
/*
	We import it here and not on the top so it is scoped and does not affect
	the rest of the ui
*/
@import '@/assets/main.css';
</style>
