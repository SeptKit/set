<template>
	<nav class="navbar bg-base-100 shadow-sm min-h-10 px-0.5 py-0">
		<template v-for="item in navigation">
			<Dropdown
				v-if="item.children.length > 0"
				:key="item.id"
				:id="item.id"
				ref="dropdowns"
				color="secondary"
				variant="ghost"
				size="sm"
				modifier="wide"
				@open="() => closeOtherSubMenus(item.id)"
			>
				<!-- If there is a path -->
				<template v-slot:label> {{ item.label }} </template>
				<template v-slot:items>
					<li v-for="subItem in item.children" :key="subItem.id">
						<button @click="() => closeAfterExecute(item.id, subItem)()">
							{{ subItem.label }}
						</button>
					</li>
				</template>
			</Dropdown>

			<!-- If there is no Path -->
			<button v-if="item.children.length === 0" :key="item.id" @click="() => item.action(item.id)">
				{{ item.label }}
			</button>
		</template>
		<ActiveFileInfo />
	</nav>
</template>

<script setup lang="ts">
import { computed, reactive, ref, type ComputedRef } from 'vue'
import { Dropdown } from '@septkit/ui'
import type { ActionFn, NavBarItem } from './navbar-item'
import ActiveFileInfo from './active-file-info.vue'

const dropdowns = ref<(typeof Dropdown)[]>([])

const props = defineProps<{
	items: NavBarItem[]
}>()

const navigation: ComputedRef<NavigationItem[]> = computed(() => {
	const navItems: NavigationItem[] = []
	for (const item of props.items) {
		const hasPath = item.path.length > 0
		const mainItem = !hasPath
		const subItem = hasPath

		if (mainItem) {
			const mainItemExists = navItems.find((n) => n.label === item.label)
			if (mainItemExists) {
				continue
			}

			navItems.push({
				id: item.id,
				label: item.label,
				children: [],
				action: closeOtherSubMenus,
			})
		}

		if (subItem) {
			const navItem = ensurePath(navItems, item)
			navItem.children.push({
				id: item.id,
				label: item.label,
				children: [],
				action: item.action,
			})
		}
	}

	return navItems
})

type NavigationItem = {
	id: string
	label: string
	children: NavigationItem[]
	action: (id: string) => void
}

function ensurePath(navItems: NavigationItem[], newItem: NavBarItem): NavigationItem {
	// debugger
	let currentNavItem: NavigationItem = {
		id: 'N/A',
		label: 'N/A',
		action: closeOtherSubMenus,
		children: navItems,
	}

	for (const section of newItem.path) {
		const wantedNavItem = currentNavItem.children.find((c) => c.label === section)
		if (wantedNavItem) {
			currentNavItem = wantedNavItem
			continue
		}

		const newNavItem = {
			id: section,
			label: section,
			children: [],
			action: closeOtherSubMenus,
		}

		currentNavItem.children.push(newNavItem)
		currentNavItem = newNavItem
	}

	return currentNavItem
}

function closeOtherSubMenus(exceptionId: string) {
	for (const dropdown of dropdowns.value as (typeof Dropdown)[]) {
		if (dropdown.id === exceptionId) {
			continue
		}
		dropdown.close()
	}
}

function closeAfterExecute(mainItemId: string, subItem: NavigationItem): () => void {
	return function () {
		subItem.action(subItem.id)
		const wantedDropdown = dropdowns.value.find((d) => d.id === mainItemId)
		if (!wantedDropdown) {
			console.warn({ msg: 'could not find dropdown to close', itemId: dropdowns })
			return
		}

		wantedDropdown.close()
	}
}
</script>
