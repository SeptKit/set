import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NavBarItem } from './navbar/navbar-item'

export const useMenuStore = defineStore('menu', () => {
	const _menuItems = ref<NavBarItem[]>([])

	return {
		menuItems: computed(() => _menuItems),
		setMenuItems,
	}

	function setMenuItems(newMenuItems: NavBarItem[]) {
		_menuItems.value = newMenuItems
	}
})
