<script setup lang="ts">
import Navbar from './components/navbar/navbar.vue'
import { useMainAreaWidgetStore } from './extension/extension-store'
import Layout from './layout.vue'
import MainArea from './main-area/main-area.vue'
</script>

<template>
	<Layout>
		<template #menubar>
			<Navbar />
		</template>

		<template #activity-bar>
			<span></span>
		</template>

		<template #primary-sidebar>
			<span>Primary sidebar</span>
		</template>

		<template #main-area>
			<MainArea />
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
