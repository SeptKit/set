<template>
	<Layout>
		<template #main>
			<h1>Vue Extension Widget A</h1>
			<span>file: {{ fileName }}</span>
		</template>

		<template #sidebar>
			<Sidebar />
		</template>
	</Layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Layout from './layout.vue'
import Sidebar from './skeleton/sidebar.vue'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let fileName = ref('')
let unsubscribe = () => {}

onMounted(() => {
	unsubscribe = props.api.activeFileName.subscribe((newFile, oldFile) => {
		fileName.value = newFile
	})

	fileName.value = props.api.activeFileName.value
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
@import './assets/main.css';

header {
	line-height: 1.5;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}
}
</style>
