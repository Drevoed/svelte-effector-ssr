import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { babel } from '@rollup/plugin-babel';
import windicss from 'vite-plugin-windicss';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},

		vite: {
			resolve: {
				alias: {
					$features: path.resolve('./src/features'),
				},
			},

			plugins: [
				windicss(),
				babel({
					plugins: ["effector-logger/babel-plugin"],
					extensions: ['.js', '.ts', '.tsx', '.mjs', '.html', '.svelte'],
					babelHelpers: 'bundled',
					include: ['src/**', 'node_modules/svelte/**'],
					ignore: [/.css$/],
				}),
			]
		}
	}
};

export default config;
