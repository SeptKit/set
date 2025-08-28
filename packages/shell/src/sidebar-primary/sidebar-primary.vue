<template>
	<div class="root">
		sidebar widget
		<div class="content">
			<WidgetSite :widget="store.activeWidget" rootId="sidebar-primary-widget-root" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePrimarySidebarWidgetStore } from '../extension/extension-store'
import WidgetSite from '../extension/widget/widget-site.vue'

const store = usePrimarySidebarWidgetStore()
</script>

<style scoped>
@import '@/assets/main.css';
</style>
