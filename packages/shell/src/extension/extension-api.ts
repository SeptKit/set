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
		setTimeout(() => listener(_activeFileName ?? '' + Math.random(), _activeFileName), 2_000)
	}
}

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
