import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

export default defineConfig([
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist', // сохраняет структуру папок
			format: 'es',
			sourcemap: true,
			preserveModules: true, // 💡 ключевой момент
			preserveModulesRoot: 'src',
		},
		plugins: [typescript({ tsconfig: './tsconfig.json' })],
		external: [], // можешь добавить зависимости, которые не хочешь включать
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
