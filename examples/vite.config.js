import { transformAsync } from '@babel/core';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Standard (TC39) decorators aren't handled by esbuild (Vite's default
// transformer), so transform the demos that use `@bem` with Babel — the same
// standard-decorators plugin the packages use for their tests. Scoped to the
// Lit and web-components demo directories so it doesn't touch the React/core
// demos or dependencies.
const decoratorDirs = ['/src/lit/', '/src/webcomponents/'];
const standardDecorators = {
	name: 'standard-decorators',
	enforce: 'pre',
	async transform(code, id) {
		const path = id.replace(/\\/g, '/');
		if (
			!path.endsWith('.js') ||
			!decoratorDirs.some((dir) => path.includes(dir))
		) {
			return null;
		}
		const result = await transformAsync(code, {
			filename: id,
			// `modules: false` keeps ESM for Vite; preset-env supplies the class
			// field / static-block transforms the decorator output needs.
			presets: [
				['@babel/preset-env', { targets: { esmodules: true }, modules: false }],
			],
			plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]],
			sourceMaps: true,
		});
		return result ? { code: result.code, map: result.map } : null;
	},
};

// Multi-page: one HTML entry per package demo. `@vitejs/plugin-react` handles
// JSX (.jsx only). Run `npm run build` at the repo root first so the linked
// @bem-broom/* packages resolve to their built dist.
export default defineConfig({
	plugins: [react({ include: /\.jsx$/ }), standardDecorators],
	build: {
		rollupOptions: {
			input: {
				main: 'index.html',
				core: 'core.html',
				react: 'react.html',
				webcomponents: 'webcomponents.html',
				lit: 'lit.html',
			},
		},
	},
});
