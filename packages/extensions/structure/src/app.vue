<template>
	<Layout>
		<div
			class="min-h-screen flex flex-col items-center justify-center"
			:style="{
				background: 'repeating-linear-gradient(45deg, #ffe066, #ffe066 30px, #fff 30px, #fff 60px)',
			}"
		>
			<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">Structure</h1>
			<h2 class="text-2xl text-center font-semibold my-4">Template for SET Extensions</h2>
			<h2 class="text-2xl text-center font-semibold my-4">file: {{ fileName }}</h2>
		</div>
	</Layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

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

@reference "@/assets/main.css";
</style>
