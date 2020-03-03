export default {
	coverageReporters: ['json-summary', 'text'],
	displayName: 'react',
	testEnvironment: 'jsdom',
	rootDir: './',
	testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/(?!@?lit.*/)'],
};
