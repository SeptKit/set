import { watch } from 'vue'
import { useFileStore } from '../data-management/data-management.store'
import type { Optional } from '../x/types'

let extensionAPI: API
export function useExtensionAPI(): API {
	if (!extensionAPI) {
		extensionAPI = createAPI()
	}

	return extensionAPI
}

function createAPI() {
	return {
		activeFileName: createActiveFileNameStore(),
	}
}

export type API = ReturnType<typeof createAPI>

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

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
