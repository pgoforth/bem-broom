export default {
	coverageReporters: ['json-summary', 'text'],
	// The barrel is pure re-exports (no logic); the public-API test guards it.
	coveragePathIgnorePatterns: ['index\\.js$'],
	displayName: 'react',
	testEnvironment: 'jsdom',
	rootDir: './',
	testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/(?!@?lit.*/)'],
};
