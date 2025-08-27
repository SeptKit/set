import { watch } from 'vue'
import { useFileStore } from '../data-management/data-management.store'
import type { Optional } from '../x/types'
import type { WidgetContribution } from './extension'
import { useSecondarySidebarWidgetStore } from './extension-store'

let _extensionAPI: API

// Note: we create the api on the first use because pinia first needs to be
// initalized and that happens in setups scripts. If we would just create
// a globla variable it would run before pinia gets initalised
export function useExtensionAPI(): API {
	if (!_extensionAPI) {
		_extensionAPI = createAPI()
	}

	return _extensionAPI
}

function createAPI() {
	return {
		activeFileName: createActiveFileNameStore(),
		secondarySidebar: createSecondarySidebarAPI(),
	}
}

function createActiveFileNameStore() {
	let _listeners: Listener[] = []
	let _activeFileName: string | undefined
	const _fileStore = useFileStore()

	watch(() => _fileStore.currentActiveFileDatabaseName, sendNewFileName)
	_activeFileName = _fileStore.currentActiveFileDatabaseName

	return {
		get value() {
			return _activeFileName
		},
		subscribe,
	}

	function subscribe(listener: Listener) {
		_listeners.push(listener)

		return function unsubscribe() {
			_listeners = _listeners.filter((ln) => ln !== listener)
		}
	}
	function sendNewFileName(newFileName: string) {
		for (const listener of _listeners) {
			listener(newFileName, _activeFileName)
		}
		_activeFileName = newFileName
	}
}

function createSecondarySidebarAPI() {
	const _store = useSecondarySidebarWidgetStore()

	return {
		get widgets() {
			return _store.widgets
		},
		findWidgetById,
		activateWidget: _store.activateWidget,
	}

	function findWidgetById(id: string): WidgetContribution | undefined {
		return _store.widgets.find((w) => w.id === id)
	}
}

export type API = ReturnType<typeof createAPI>

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
