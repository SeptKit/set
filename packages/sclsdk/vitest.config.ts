import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		browser: {
			provider: 'playwright',
			enabled: true,
			headless: true,
			instances: [{ browser: 'chromium' }],
		},
		include: ['src/**/*.test.{js,ts,jsx,tsx}'],
		watch: false,
	},
})
