export default {
	coverageReporters: ['json-summary', 'text'],
	// The barrel is pure re-exports (no logic); the public-API test guards it.
	coveragePathIgnorePatterns: ['index\\.js$'],
	displayName: 'webcomponents',
	testEnvironment: 'jsdom',
	rootDir: './',
	testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
	},
	// @lit/context ships as ESM; let babel-jest transform it (don't ignore).
	transformIgnorePatterns: ['/node_modules/(?!(@lit)/)'],
};
