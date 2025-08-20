<template>
	<div class="root" name="ext-structure-root">
		<h3>Data Structure</h3>
		<Diagram :nodes="initialNodes" :edges="initialEdges" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Diagram from './diagram/diagram.vue'
import { initialEdges, initialNodes } from './initial-elements'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let fileName = ref('')
let unsubscribe = () => {}

onMounted(() => {
	unsubscribe = props.api.activeFileName.subscribe((newFile: string, oldFile: any) => {
		fileName.value = newFile
	})
})

onUnmounted(() => {
	unsubscribe()
})
</script>

<style>
@import './app.css';
</style>

<style scoped>
/*
	We import it here and not on the top so it is scoped and does not affect
	the rest of the ui
*/

.root {
	height: 100%;
}
</style>
