import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
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
		cssCodeSplit: true,
		lib: {
			// entry: fileURLToPath(new URL('./src/shell.js', import.meta.url)),
			entry: {
				shell: fileURLToPath(new URL('./src/shell.js', import.meta.url)),
				'sidebar-primary': fileURLToPath(new URL('./src/sidebar-primary.js', import.meta.url)),
				// menu: fileURLToPath(new URL('./src/menu.js', import.meta.url)),
			},
			formats: ['es'],
			fileName: (_, entry) => `${entry}.js`,
		},
	},
	define: {
		'process.env': process.env,
	},
})
