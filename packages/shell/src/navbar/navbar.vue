<script setup lang="ts">
import { useTemplateRef } from 'vue'
// UI LIBRARY
import { Dropdown } from '@septkit/ui'
// STORES
import { useFileStore } from './store'

// refs
const dropdownOpen = useTemplateRef('dropdown-file-ref')
const dropdownImport = useTemplateRef('dropdown-import-ref')
// stores
const fileStore = useFileStore()

//====== FUNCTIONS ======//

async function handleFileOpen() {
	await fileStore.openFiles()
	dropdownOpen.value?.close()
}

async function handleFileSave() {
	console.log('Saving file...')
	await fileStore.saveFile()
	dropdownOpen.value?.close()
}

async function handleImportOpen() {
	await fileStore.importFile()
	dropdownImport.value?.close()
}
</script>

<template>
	<nav class="navbar bg-base-100 shadow-sm min-h-10 px-0.5 py-0">
		<Dropdown ref="dropdown-file-ref" color="secondary" variant="ghost" size="sm" modifier="wide">
			<template v-slot:label> File </template>
			<template v-slot:items>
				<li>
					<button @click="handleFileOpen">Open...</button>
				</li>
				<li>
					<button @click="handleFileSave">Save...</button>
				</li>
			</template>
		</Dropdown>
		<Dropdown ref="dropdown-import-ref" color="secondary" variant="ghost" size="sm" modifier="wide">
			<template v-slot:label> Import </template>
			<template v-slot:items>
				<li>
					<button @click="handleImportOpen">Open...</button>
				</li>
			</template>
		</Dropdown>
	</nav>
</template>
