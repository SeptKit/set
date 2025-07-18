import type { Optional } from '../x/types'

export function useExtensionAPI(): API {
	return extensionAPI
}

const extensionAPI = createAPI()

function createAPI() {
	return {
		activeFileName: createActiveFileNameStore(),
	}
}

export type API = ReturnType<typeof createAPI>

function createActiveFileNameStore() {
	let _activeFileName: string | undefined

	return {
		get value() {
			return _activeFileName
		},
		subscribe,
	}

	function subscribe(listener: Listener) {
		setTimeout(() => sendRandomFilenName(listener), 2_000)
	}
	function sendRandomFilenName(listener: Listener) {
		listener(_activeFileName ?? '' + Math.random(), _activeFileName)
		setTimeout(() => sendRandomFilenName(listener), 2_000)
	}
}

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
