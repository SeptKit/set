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
	optimizeDeps: {
		// We exclude our own libraries so we can use the local versions
		// to debug. This is needed because vite and vitest caches and optimizes
		// the dependencies and do not updated them real time
		exclude: ['@septkit/fileio', '@septkit/ui'],
	},
	server: {
		port: 53995,
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
})
