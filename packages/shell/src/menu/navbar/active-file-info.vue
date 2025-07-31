<template>
	<svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
			<circle
				cx="12"
				cy="12"
				r="10"
				fill="none"
				stroke="currentColor"
				stroke-linecap="square"
				stroke-miterlimit="10"
				stroke-width="2"
			></circle>
			<path
				d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5"
				fill="none"
				stroke="currentColor"
				stroke-linecap="square"
				stroke-miterlimit="10"
				stroke-width="2"
			></path>
			<circle cx="12" cy="7.25" r="1.25" fill="currentColor" stroke-width="2"></circle>
		</g>
	</svg>
	<div class="badge badge-ghost badge-sm font-semibold">{{ activeFile }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/data-management/data-management.store'

const fileStore = useFileStore()
const { currentActiveFileDatabaseName } = storeToRefs(fileStore)

const activeFile = computed(() => {
	return currentActiveFileDatabaseName.value
		? `Active File: ${currentActiveFileDatabaseName.value}`
		: 'No active file'
})
</script>
