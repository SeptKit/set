<template>
	<Layout>
		<template #menubar>
			<Navbar :items="navBarItems" />
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

<script setup lang="ts">
import type { NavBarItem } from './components/navbar/navbar-item'
import Navbar from './components/navbar/navbar.vue'
import Layout from './layout.vue'

const navBarItems: NavBarItem[] = [
	{ id: 'file.open', label: 'Open', path: ['File'], action: noop },
	{ id: 'file.save', label: 'Save', path: ['File'], action: noop },
	{ id: 'import.function', label: 'Function', path: ['Import'], action: noop },
]
function noop() {}
</script>

<style>
@reference "@/assets/main.css";
</style>
