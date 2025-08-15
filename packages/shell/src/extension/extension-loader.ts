import type { Optional } from '../x/types'
import type { Extension, MenuContribution, StartFn, WidgetContribution } from './extension'
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
				.map(async (extUrl) => {
					const extDef = await fetchExtensionDefinition(extUrl)
					return {
						id: extDef.name,
						version: extDef.version,
						label: extDef.displayName,
						contributions: [
							...(extDef.contributes.customEditors?.map((def) =>
								mapWidgets(def, extUrl, 'mainArea'),
							) ?? []),

							...(extDef.contributes.primarySidebars?.map((def) =>
								mapWidgets(def, extUrl, 'primarySidebar'),
							) ?? []),

							...(extDef.contributes.secondarySidebars?.map((def) =>
								mapWidgets(def, extUrl, 'secondarySidebar'),
							) ?? []),

							...(extDef.contributes.menu?.map((def) => mapMenu(def, extUrl)) ?? []),
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

function mapWidgets(
	def: CustomEditorDefinition | SidebarWidgetDefinition,
	extUrl: string,
	location: WidgetContribution['location'],
): WidgetContribution {
	return {
		id: def.id,
		type: 'widget',
		label: def.displayName,
		icon: def.icon,
		location: location,
		startFnUrl: generateEntrypointUrl(def.entryPoint, extUrl),
	}
}

function mapMenu(def: MenuDefinition, extUrl: string): MenuContribution {
	return {
		id: def.id,
		type: 'menu',
		label: def.displayName,
		icon: def.icon,
		menuPath: def.path ?? [],
		actionFnUrl: generateEntrypointUrl(def.entryPoint, extUrl),
	}
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

export type ExtensionDefinition = {
	name: string
	displayName: string
	version: string
	description: string
	contributes: {
		customEditors?: CustomEditorDefinition[]
		primarySidebars?: SidebarWidgetDefinition[]
		secondarySidebars?: SidebarWidgetDefinition[]
		menu?: MenuDefinition[]
	}
}

type CustomEditorDefinition = {
	id: string
	displayName: string
	icon: string // a relative path to package.json
	entryPoint: string // relative to package.json
	fileSelectors: string[] // eg.: SSD, ASD, SCD
}

type SidebarWidgetDefinition = {
	id: string
	displayName: string
	icon: string
	entryPoint: string
}

type MenuDefinition = {
	id: string
	displayName: string
	icon?: string
	entryPoint: string
	path?: string[]
}

export async function fetchWidgetStartFn(url: string): Promise<Optional<StartFn>> {
	const module = await import(/* @vite-ignore */ url)
	if (!module.default) {
		throw new Error(`Default export not found in the loaded module from ${url}`)
	}
	return module.default as StartFn
}

function generateEntrypointUrl(relativeStartFnUrl: string, baseUrl: string): string {
	const baseUrlObj = new URL(baseUrl)

	const startFnFile = relativeStartFnUrl.replace('/', '')
	const pathParts = baseUrlObj.pathname.split('/').filter(Boolean)
	pathParts.push(startFnFile)
	pathParts.unshift(baseUrlObj.origin)
	const fullPath = pathParts.join('/')

	return fullPath
}
