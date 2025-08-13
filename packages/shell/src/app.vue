<template>
	<Layout>
		<template #menubar>
			<Menu />
		</template>

		<template #activity-bar>
			<span></span>
		</template>

		<template #primary-sidebar>
			<span></span>
		</template>

		<template #main-area>
			<MainArea />
		</template>

		<template #secondary-sidebar>
			<span></span>
		</template>

		<h1 class="text-5xl font-bold text-center my-8 text-indigo-600 uppercase tracking-wider">
			SET Test
		</h1>
	</Layout>
</template>

<script setup lang="ts">
import Layout from './layout.vue'
import MainArea from './main-area/main-area.vue'
import Menu from './menu/menu.vue'
</script>

<style>
@reference "@/assets/main.css";
</style>
