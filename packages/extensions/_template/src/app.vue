<template>
	<Layout>
		<div class="min-h-screen flex flex-col items-center justify-center template-stripes">
			<h1 class="text-5xl font-bold text-center my-8 uppercase tracking-wider">__TEMPLATE__</h1>
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

let fileName = ref('test')
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
.template-stripes {
	min-height: 100vh;
	background: repeating-linear-gradient(45deg, #ffe066, #ffe066 30px, #939393 30px, #939393 60px);
}
</style>

<style>
@reference "@/assets/main.css";
</style>
