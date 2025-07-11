/// <reference types="vite/client" />

import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		tailwindcss(),
		dts({
			rollupTypes: true,
			tsconfigPath: path.resolve(__dirname, './tsconfig.app.json')
		})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./lib', import.meta.url))
		},
	},
	build: {
		sourcemap: import.meta.env?.DEV,
		lib: {
			entry: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
			fileName: (format, entryName) => {
				if (entryName === 'src/lib/index') {
					return `index.js`;
				}
				return `${entryName}.js`;
			},
			formats: ['es'],
			cssFileName: 'ui',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
				preserveModules: true,
				preserveModulesRoot: 'lib',
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name.includes('node_modules')) {
						return chunkInfo.name.replace('node_modules', 'external') + '.js';
					}

					return '[name].js';
				}
			},
		},
	},
})
