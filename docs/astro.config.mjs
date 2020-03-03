// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';

// A dedicated TypeDoc instance per package so each renders under its own package
// subfolder (/core/api, /react/api, /webcomponents/api, /lit/api) with its own
// sidebar group.
const [coreTypeDoc, coreTypeDocSidebar] = createStarlightTypeDocPlugin();
const [reactTypeDoc, reactTypeDocSidebar] = createStarlightTypeDocPlugin();
const [webcomponentsTypeDoc, webcomponentsTypeDocSidebar] =
	createStarlightTypeDocPlugin();
const [litTypeDoc, litTypeDocSidebar] = createStarlightTypeDocPlugin();

// Shared TypeDoc options. `skipErrorChecking` keeps doc generation resilient to
// cross-package type resolution (react/lit reference @bem-broom/core) — we
// document the JSDoc, we don't type-check here (that's the packages' own `tsc`).
const typeDoc = {
	excludePrivate: true,
	excludeInternal: true,
	skipErrorChecking: true,
	// Name each section's root page `index` so the overview lives at
	// /<package>/api/ (not /<package>/api/readme/).
	entryFileName: 'index',
};

// https://astro.build/config
export default defineConfig({
	// Project site: https://pgoforth.github.io/bem-broom/. `base` is the single
	// source of truth for the path prefix — internal content links hardcode it
	// as `/bem-broom/...`; switching to a custom domain means setting base to '/'
	// and find-replacing `/bem-broom/` under docs/src/content.
	site: 'https://pgoforth.github.io',
	base: '/bem-broom',
	// Always emit trailing slashes so relative resolution and links are stable.
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'bem-broom',
			description:
				'Utility for generating and parsing BEM class names using JS objects',
			logo: { src: './src/assets/bem-broom.png', alt: 'bem-broom' },
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/pgoforth/bem-broom',
				},
			],
			plugins: [
				coreTypeDoc({
					// index.js = the public runtime surface; types.js = the JSDoc
					// typedefs (BEMObject, BEMSyntax, …) referenced by the signatures,
					// so they get their own documented pages instead of bare names.
					entryPoints: [
						'../packages/core/src/index.js',
						'../packages/core/src/types.js',
					],
					tsconfig: '../packages/core/tsconfig.json',
					output: 'core/api',
					sidebar: { label: 'API', collapsed: true },
					typeDoc,
				}),
				reactTypeDoc({
					// index.js = hook/HOC/component surface; types.js = the typedefs
					// (BemConfig, UseBemOptions, WithBemConfig) referenced by them.
					entryPoints: [
						'../packages/react/src/index.js',
						'../packages/react/src/types.js',
					],
					tsconfig: '../packages/react/tsconfig.json',
					output: 'react/api',
					sidebar: { label: 'API', collapsed: true },
					typeDoc,
				}),
				webcomponentsTypeDoc({
					// index.js = decorator/mixin/context surface; types.js = the
					// typedefs (BemConfig, BemElementConfig).
					entryPoints: [
						'../packages/webcomponents/src/index.js',
						'../packages/webcomponents/src/types.js',
					],
					tsconfig: '../packages/webcomponents/tsconfig.json',
					output: 'webcomponents/api',
					sidebar: { label: 'API', collapsed: true },
					typeDoc,
				}),
				litTypeDoc({
					// index.js = decorator/controller/context surface; types.js = the
					// typedefs (BemConfig, BemControllerOptions, BemDecoratorConfig).
					entryPoints: [
						'../packages/lit/src/index.js',
						'../packages/lit/src/types.js',
					],
					tsconfig: '../packages/lit/tsconfig.json',
					output: 'lit/api',
					sidebar: { label: 'API', collapsed: true },
					typeDoc,
				}),
			],
			// Organized package-first: /<package>/<section>.
			sidebar: [
				{ label: 'Getting started', slug: 'getting-started' },
				{
					label: '@bem-broom/core',
					items: [{ label: 'Guide', slug: 'core/guides' }, coreTypeDocSidebar],
				},
				{
					label: '@bem-broom/react',
					items: [
						{ label: 'Guide', slug: 'react/guides' },
						reactTypeDocSidebar,
					],
				},
				{
					label: '@bem-broom/webcomponents',
					items: [
						{ label: 'Guide', slug: 'webcomponents/guides' },
						webcomponentsTypeDocSidebar,
					],
				},
				{
					label: '@bem-broom/lit',
					items: [{ label: 'Guide', slug: 'lit/guides' }, litTypeDocSidebar],
				},
			],
		}),
	],
});
