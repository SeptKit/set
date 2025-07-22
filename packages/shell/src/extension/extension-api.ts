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

	setTimeout(() => sendRandomFilenName(), 2_000)

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
	function sendRandomFilenName() {
		console.log({ msg: 'notifying listeners', nr: listeners.length })
		for (const listener of listeners) {
			listener(activeFileName ?? '' + Math.random(), activeFileName)
		}
		setTimeout(() => sendRandomFilenName(), 2_000)
	}
}

type Listener = (newFile: Optional<string>, oldFile: Optional<string>) => void
