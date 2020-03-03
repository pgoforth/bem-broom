// Single build targeting the ES2015 baseline in .browserslistrc.
// The source uses only ES2015 runtime APIs, so no polyfills are required.
// Module format is chosen via BABEL_ENV (esm / commonjs / test).
module.exports = {
	presets: ['@babel/preset-env'],
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
