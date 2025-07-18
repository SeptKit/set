import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/main.js', import.meta.url)),
			name: 'SkeletonVuejs',
			fileName: (format) => `skeleton-vuejs.${format}.js`,
		},
		rollupOptions: {},
	},
})
