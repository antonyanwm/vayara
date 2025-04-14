import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

export default defineConfig([
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'es',
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [typescript({ tsconfig: './tsconfig.json' })],
		external: [],
	},

	// Типы
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'es',
			preserveModules: true,
			preserveModulesRoot: 'src',
		},
		plugins: [dts()],
	},
]);
