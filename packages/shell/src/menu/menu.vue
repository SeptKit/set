<template>
	<Navbar :items="menuItems" />
</template>

<script setup lang="ts">
import { useMenuContributionsStore } from '../extension/extension-store'
import { useMenuStore } from './menu.store'
import type { NavBarItem } from './navbar/navbar-item'
import Navbar from './navbar/navbar.vue'
import { useFileStore } from '@/data-management/data-management.store'

const fileStore = useFileStore()
const menuStore = useMenuStore()
const menuContributionStore = useMenuContributionsStore()

const menuItems: NavBarItem[] = [
	{ id: 'file.open', label: 'Open', path: ['File'], action: fileStore.openFiles },
	{ id: 'file.save', label: 'Save', path: ['File'], action: fileStore.saveFile },
	{ id: 'import.function', label: 'Function', path: ['Import'], action: fileStore.importFile },
	...menuContributionStore.contributions.map((mc) => {
		return {
			id: mc.id,
			label: mc.label,
			path: mc.menuPath,
			action: () => {},
		}
	}),
]

menuStore.setMenuItems(menuItems)
</script>

<style scoped></style>
