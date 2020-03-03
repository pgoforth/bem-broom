// Single modern build. Module format is chosen via BABEL_ENV (esm / commonjs / test).
module.exports = {
	presets: [
		['@babel/preset-env', { targets: { esmodules: true } }],
		['@babel/preset-react', { runtime: 'automatic' }],
	],
	env: {
		test: {
			plugins: ['@babel/plugin-transform-modules-commonjs'],
		},
		esm: {
			presets: [['@babel/preset-env', { modules: false }]],
			plugins: [
				['replace-import-extension', { extMapping: { '.js': '.mjs' } }],
			],
		},
		commonjs: {
			plugins: [
				['replace-import-extension', { extMapping: { '.js': '.cjs' } }],
				['@babel/plugin-transform-modules-commonjs'],
			],
		},
	},
};
