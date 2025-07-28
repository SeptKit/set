import { fileURLToPath, URL } from 'node:url'
// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 55676,
	},
	plugins: [
		vue(),
		vueDevTools(),
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
		lib: {
			// entry: fileURLToPath(new URL('./src/shell.js', import.meta.url)),
			entry: {
				shell: fileURLToPath(new URL('./src/shell.ts', import.meta.url)),
				menu: fileURLToPath(new URL('./src/menu.ts', import.meta.url)),
			},
			formats: ['es'],
			fileName: (_, entry) => `${entry}.js`,
		},
	},
	define: {
		'process.env': process.env,
	},
})
