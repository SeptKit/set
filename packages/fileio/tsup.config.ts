import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
	name: 'septkit-fileio',
	entry: {
		index: 'src/index.ts',
	},
	clean: true,
	format: ['esm'],
	sourcemap: true,
	dts: {
		// Skip type checking for faster builds
		compilerOptions: {
			skipLibCheck: true
		}
	},
	treeshake: true,
	splitting: false,
	minify: !options.watch,
	outExtension: () => ({ js: '.js' }),
}))
