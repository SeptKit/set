import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default mergeConfig(
	viteConfig,
	defineConfig({
		optimizeDeps: {
			// We exclude our own libraries so we can use the local versions
			// to debug. This is needed because vite and vitest caches and optimizes
			// the dependencies and do not updated them real time
			exclude: ['@septkit/fileio'],
		},
		test: {
			watch: false,
			projects: [
				{
					resolve: viteConfig.resolve,
					plugins: [vue(), tailwindcss()], //necessary for vue files: github.com/vitest-dev/vitest/issues/6293
					test: {
						name: 'unit',
						browser: {
							provider: 'playwright',
							enabled: true,
							headless: true,
							instances: [{ browser: 'chromium' }],
							// instances: [{ browser: 'firefox' }],
						},
						include: ['src/**/*.test.{js,ts,jsx,tsx}'],
						exclude: [...configDefaults.exclude],
						root: fileURLToPath(new URL('./', import.meta.url)),
					},
				},
			],
		},
	}),
)
