<template>
	<div>
		<h2>Secondary Sidebar Widget</h2>
		<span>Mount Time: {{ mountTime }}</span>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const mountTime = ref(new Date().toISOString())

onMounted(() => {
	mountTime.value = new Date().toLocaleTimeString()
})
</script>

<style scoped>
h2 {
	font-size: 1.5rem;
	padding: 0.5rem;
}
</style>
