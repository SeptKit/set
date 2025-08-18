<template>
	<div class="root" name="ext-structure-root">
		<h3>Data Structure</h3>
		<Diagram />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Diagram from './diagram/diagram.vue'
import '@/assets/vueflow.css'

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

<style scoped>
/*
	We import it here and not on the top so it is scoped and does not affect
	the rest of the ui
*/
@import '@/assets/main.css';

.root {
	height: 100%;
}
</style>
