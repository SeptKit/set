<template>
	<Navbar :items="menuItems" :activeFileName="fileStore.currentActiveFileDatabaseName" />
</template>

<script setup lang="ts">
import { computed, reactive, ref, type ComputedRef, type Ref } from 'vue'
import { useMenuContributionsStore } from '../extension/extension-store'
import { useMenuStore } from './menu.store'
import type { ActionFn, NavBarItem } from './navbar/navbar-item'
import Navbar from './navbar/navbar.vue'
import { useFileStore } from '@/data-management/data-management.store'
import type { MenuContribution } from '../extension/extension'
import { storeToRefs } from 'pinia'
import { type AsyncComputedOptions, computedAsync } from '@vueuse/core'

const fileStore = useFileStore()
// const menuStore = useMenuStore()
const menuContributionStore = useMenuContributionsStore()

const builtInItems: NavBarItem[] = [
	{ id: 'file.open', label: 'Open', path: ['File'], action: fileStore.openFiles },
	{ id: 'file.save', label: 'Save', path: ['File'], action: fileStore.saveFile },
]

// const menuItems: AsyncComputedOptions<NavBarItem[]> = computedAsync(async () => {
const menuItems = computedAsync(async () => {
	const { contributions } = storeToRefs(menuContributionStore)

	const navBarItems: NavBarItem[] = []
	for (const cont of contributions.value) {
		const action = await fetchAction(cont)
		const navBarItem: NavBarItem = {
			id: cont.id,
			label: cont.label,
			path: cont.menuPath,
			action,
		}
		navBarItems.push(navBarItem)
	}

	return [...builtInItems, ...navBarItems]
}, builtInItems)

async function fetchAction(mc: MenuContribution): Promise<ActionFn> {
	const url = mc.actionFnUrl
	if (!url) {
		return noop
	}
	const module = await import(/* @vite-ignore */ url)
	const action = module.default

	return action
}

function noop() {}

// menuStore.setMenuItems(menuItems)
</script>

<style scoped></style>
