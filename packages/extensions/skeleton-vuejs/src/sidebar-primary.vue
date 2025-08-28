<template>
	<div>
		<h2>Primary Sidebar Widget</h2>
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
	padding: 1rem;
	font-size: 2rem;
}
</style>
