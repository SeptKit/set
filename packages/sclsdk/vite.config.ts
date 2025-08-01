/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'node:url'
// VITE
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: false,
		sourcemap: import.meta.env?.DEV,
		lib: {
			entry: [
				fileURLToPath(new URL('./src/v2007C5/index.ts', import.meta.url)),
				fileURLToPath(new URL('./src/v2019C1/index.ts', import.meta.url)),
			],
			fileName: 'index',
			name: 'SCLSDK',
			formats: ['es'],
		},
	},
})
