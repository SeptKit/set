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
	let listeners: Listener[] = []
	let activeFileName: string | undefined

	setTimeout(() => sendRandomFileName(), 2_000)

	return {
		get value() {
			return activeFileName
		},
		subscribe,
	}

	function subscribe(listener: Listener) {
		listeners.push(listener)

		return function unsubscribe() {
			listeners = listeners.filter((ln) => ln !== listener)
		}
	}
	function sendRandomFileName() {
		for (const listener of listeners) {
			listener(activeFileName ?? '' + Math.random(), activeFileName)
		}
		setTimeout(() => sendRandomFileName(), 2_000)
	}
}

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
