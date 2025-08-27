<template>
	<Layout>
		<template #menubar>
			<Menu />
		</template>

		<template #activity-bar>
			<ActivityBar />
		</template>

		<template #primary-sidebar>
			<SidebarPrimary />
		</template>

		<template #main-area>
			<MainArea />
		</template>
	</Layout>
</template>

<script setup lang="ts">
import Layout from './layout.vue'
import MainArea from './main-area/main-area.vue'
import SidebarPrimary from './sidebar-primary/sidebar-primary.vue'
import Menu from './menu/menu.vue'
import ActivityBar from './activity-bar/activity-bar.vue'
</script>

<style>
@import '@/assets/main.css';
</style>
