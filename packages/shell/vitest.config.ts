import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			watch: false,
			projects: [
				{
					resolve: viteConfig.resolve,
					plugins: [vue(), tailwindcss()], //neccessary for vue files: github.com/vitest-dev/vitest/issues/6293
					test: {
						name: 'unit',
						browser: {
							provider: 'playwright',
							enabled: true,
							headless: true,
							instances: [{ browser: 'chromium' }],
						},
						include: ['src/**/*.test.{js,ts,jsx,tsx}'],
						exclude: [...configDefaults.exclude],
						root: fileURLToPath(new URL('./', import.meta.url)),
					},
				},
				{
					plugins: [vue(), tailwindcss()], //neccessary for vue files: github.com/vitest-dev/vitest/issues/6293
					test: {
						name: 'e2e',
						browser: {
							provider: 'playwright',
							enabled: true,
							headless: true,
							instances: [{ browser: 'chromium' }],
						},
						include: ['e2e/**/*.test.{js,ts,jsx,tsx}'],
						exclude: [...configDefaults.exclude],
						root: fileURLToPath(new URL('./', import.meta.url)),
					},
				},
			],
		},
	}),
)
