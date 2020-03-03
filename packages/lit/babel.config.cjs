// Single modern build. Module format is chosen via BABEL_ENV (esm / commonjs / test).
// The library source itself contains no decorator syntax — `bem()` is a plain
// function that returns a standard class decorator — so decorators are only
// transformed in the `test` env (test components apply `@bem`/`@customElement`).
module.exports = {
	presets: [['@babel/preset-env', { targets: { esmodules: true } }]],
	env: {
		test: {
			plugins: [
				['@babel/plugin-proposal-decorators', { version: '2023-11' }],
				'@babel/plugin-transform-modules-commonjs',
			],
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
				'@babel/plugin-transform-modules-commonjs',
			],
		},
	},
};
