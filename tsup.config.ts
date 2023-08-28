import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['index.ts'],
	format: ['cjs', 'esm'],
	sourcemap: true,
	outDir: 'dist',
});
