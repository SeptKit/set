import { fileURLToPath, URL } from 'node:url'
// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ['@septkit/fileio'],
	},
	server: {
		port: 55676,
	},
	plugins: [
		vue(),
		vueDevTools(),
		tailwindcss(),
		cssInjectedByJsPlugin({ relativeCSSInjection: true }),
		viteStaticCopy({
			targets: [
				{
					src: 'package.json',
					dest: '', // Copies to dist/
				},
			],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		// `emptyOutDir` is disabled so the extension reload functionality of
		// shell does not throw errors until the code generation is finished
		emptyOutDir: false,
		// `cssCodeSplit` is needed because we have multiple entry points
		cssCodeSplit: true,
		lib: {
			// entry: fileURLToPath(new URL('./src/shell.js', import.meta.url)),
			entry: {
				shell: fileURLToPath(new URL('./src/shell.js', import.meta.url)),
				menu: fileURLToPath(new URL('./src/menu.js', import.meta.url)),
			},
			formats: ['es'],
			fileName: (_, entry) => `${entry}.js`,
		},
	},
	define: {
		'process.env': process.env,
	},
})
