import { fileURLToPath, URL } from 'node:url'
// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS

// https://vite.dev/config/
export default defineConfig({
	plugins: [],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		lib: {
			entry: './src/index.ts',
			fileName: (format, entryName) => {
				return `${entryName}.js`
			},
			formats: ['es'],
		},
	},
})
