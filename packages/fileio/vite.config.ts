import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		dts({
			tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
		}),
	],
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
