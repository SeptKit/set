<template>
	<div class="root">
		sidebar widget
		<div class="content">
			<WidgetSite :widget="store.activeWidget" rootId="sidebar-secondary-widget-root" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSecondarySidebarWidgetStore } from '../extension/extension-store'
import WidgetSite from '../extension/widget/widget-site.vue'

const store = useSecondarySidebarWidgetStore()
</script>

<style scoped>
@import '@/assets/main.css';
</style>
