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
	server: {
		port: 55608,
	},
	plugins: [
		vue(),
		vueDevTools(),
		cssInjectedByJsPlugin({ relativeCSSInjection: true }),
		tailwindcss(),
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
			entry: {
				'sidebar-primary': fileURLToPath(new URL('./src/sidebar-primary.js', import.meta.url)),
			},
			formats: ['es'],
			fileName: (_, entry) => `${entry}.js`,
		},
	},
	define: {
		'process.env': process.env,
	},
})
