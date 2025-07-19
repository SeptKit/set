import type { Optional } from '../x/types'
import type { Extension, StartFn, WidgetContribution } from './extension'
import { useExtensionStore } from './extension-store'

export async function loadExtensions(extensionDefinitionLocations: string[]) {
	const store = useExtensionStore()

	const extensions = await fetchExtensionDefinitions(extensionDefinitionLocations)

	store.setExtensions(extensions)
}

/**
 *
 * @param extensionDefinitionLocations a list of urls to package.json files
 * TODO: make it more readable
 */
async function fetchExtensionDefinitions(
	extensionDefinitionLocations: string[],
): Promise<Extension[]> {
	const extensions = (
		await Promise.allSettled(
			extensionDefinitionLocations
				.map(async (location) => {
					const extDef = await fetchExtensionDefinition(location)
					return {
						id: extDef.name,
						version: extDef.version,
						label: extDef.displayName,
						contributions: [
							...extDef.contributes.customEditors.map((editorDef) => {
								return {
									id: editorDef.id,
									type: 'widget',
									label: editorDef.displayName,
									icon: editorDef.icon,
									location: 'mainArea',
									startFnUrl: generateStartFnUrl(editorDef.entryPoint, location),
								} satisfies WidgetContribution
							}),
						],
					}
				})
				.filter(Boolean),
		)
	)
		.filter((p) => p.status === 'fulfilled')
		.map((p) => p.value)

	return extensions
}

async function fetchExtensionDefinition(url: string): Promise<ExtensionDefinition> {
	try {
		const packageJsonUrl = new URL('package.json', url).toString()
		const response = await fetch(packageJsonUrl)

		if (!response.ok) {
			throw new Error(`Failed to fetch package.json from ${packageJsonUrl}`)
		}

		const packageJson = await response.json()

		return packageJson
	} catch (error) {
		console.error('Error fetching package.json:', error)
		throw error
	}
}

type ExtensionDefinition = {
	name: string
	displayName: string
	version: string
	description: string
	contributes: {
		customEditors: {
			id: string
			displayName: string
			icon: string // a relative path to package.json
			entryPoint: string // relative to package.json
			fileSelectors: string[] // eg.: SSD, ASD, SCD
		}[]
	}
}

export async function fetchWidgetStartFn(url: string): Promise<Optional<StartFn>> {
	const module = await import(/* @vite-ignore */ url)
	if (!module.default) {
		throw new Error(`Default export not found in the loaded module from ${url}`)
	}
	return module.default as StartFn
}

function generateStartFnUrl(relativeStartFnUrl: string, baseUrl: string): string {
	const startFnUrl = new URL(relativeStartFnUrl, baseUrl).toString()

	return startFnUrl
}
