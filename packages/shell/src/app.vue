<script setup lang="ts">
import Navbar from './navbar/navbar.vue'
import Layout from './layout.vue'
</script>

<template>
	<Layout>
		<template #menubar>
			<Navbar />
		</template>

		<template #activity-bar>
			<span>ACTION</span>
		</template>

		<template #primary-sidebar>
			<span>Primary sidebar</span>
		</template>

		<template #main-area>
			<span> main area </span>
		</template>

		<template #secondary-sidebar>
			<span> secondary sidebar </span>
		</template>

		<h1 class="text-5xl font-bold text-center my-8 text-indigo-600 uppercase tracking-wider">
			SET
		</h1>
	</Layout>
</template>

<style>
@reference "@/assets/main.css";
</style>
