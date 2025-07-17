<!-- <template>
	<div class="extenstion-container">
		<p>Plugin: {{ plugin }}</p>
		<p>editCount: {{ _editCount }}</p>
		<div :id="EXTENSION_ROOT_ID" ref="pluginWrapperRef">&nbsp;</div>
	</div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref } from 'vue'
import { useExtensionAPI } from './extension-api'
import type { Optional } from '../common/types'
import { createAPI, API } from '@openscd/core'
import type { InitFn } from './extension'

const EXTENSION_ROOT_ID = 'extension-root'
const pluginWrapperRef = ref<HTMLDivElement | null>(null)

const { plugin } = defineProps<{
	plugin: Optional<string>
}>()

const api = useExtensionAPI()
console.debug('created extension api', { api })

onMounted(() => {
	watch(() => plugin, onPluginChange)
})

function onPluginChange(newPlugin: Optional<string>, oldPlugin: Optional<string>) {
	console.debug({ msg: 'changing plugin', oldPlugin, newPlugin })
	if (!newPlugin) {
		return
	}

	loadExtension(newPlugin)
}

// function passOnAPI(newAPI: API) {
// 	const pluginRoot = findPluginRoot()
// 	if (!pluginRoot) {
// 		console.warn('could not find plugin root, stopping')
// 		return
// 	}

// 	// @ts-expect-error
// 	pluginRoot.api = newAPI
// }

// function findPluginRoot(): Optional<HTMLElement> {
// 	const pluginWrapper = pluginWrapperRef.value

// 	if (!pluginWrapper) {
// 		return null
// 	}
// 	if (pluginWrapper.childElementCount === 0) {
// 		return null
// 	}

// 	const pluginRoot = pluginWrapper.children[0] as HTMLElement

// 	return pluginRoot
// }

async function loadExtension(url: string) {
	try {
		// const initType = await determineInitType(url)

		// if (initType === 'function') {
		// const extension = await loadExtensionWithInitFn(url)
		// } else if (initType === 'webcomponent') {
		// await loadPluginAsWebComponent(url)
		// } else {
		// console.error(`Unsupported initType: ${initType} loaded from ${url}`)
		// }

		const extension = await loadExtensionWithInitFn(url)
	} catch (error) {
		console.error(`Error loading plugin:${error} from ${url}`)
	}
}

async function determineInitType(url: string): Promise<string> {
	try {
		const packageJsonUrl = new URL('package.json', url).toString()
		const response = await fetch(packageJsonUrl)

		if (!response.ok) {
			throw new Error(`Failed to fetch package.json from ${packageJsonUrl}`)
		}

		const packageJson = await response.json()
		if (!packageJson.initType) {
			throw new Error(`initType not found in package.json imported from ${url}`)
		}

		return packageJson.initType
	} catch (error) {
		console.error('Error determining initType:', error)
		throw error
	}
}

async function loadExtensionWithInitFn(url: string) {
	const init = await importPluginModule<InitFn>(url)
	if (!init) {
		return
	}

	try {
		const extension = init()
		return extension
	} catch (error) {
		console.error('Error initializing plugin with default function:', error)
	}
}

async function loadPluginAsWebComponent(url: string) {
	const customElementClass = await importPluginModule<typeof HTMLElement>(url)
	if (!customElementClass) {
		return
	}

	try {
		const CustomElement = customElementClass
		const elementName = `custom-element-${Date.now()}` // Generate a unique tag name
		customElements.define(elementName, CustomElement)

		const pluginRoot = document.getElementById(PLUGIN_WRAPPER_KEY)
		if (!pluginRoot) {
			console.error('Plugin root element not found; stopping.')
			return
		}

		pluginRoot.innerHTML = '' // Clear previous content
		const customElementInstance = document.createElement(elementName)
		pluginRoot.appendChild(customElementInstance)
	} catch (error) {
		console.error('Error loading plugin as web component:', error)
	}
}

async function importPluginModule<T extends InitFn | typeof HTMLElement>(url: string): Promise<T> {
	const module = await import(/* @vite-ignore */ url)
	if (!module.default) {
		throw new Error(`Default export not found in the loaded module from ${url}`)
	}
	return module.default as T
}
</script>

<style scoped>
.engine {
	/* Component styles */
}
</style> -->
