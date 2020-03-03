export default {
	coveragePathIgnorePatterns: ['__tests__'],
	coverageReporters: [
		'json',
		'lcov',
		'json-summary',
		'text', // Output to the CLI also
		['text', { file: 'coverage.txt', skipFull: true }],
	],
	coverageThreshold: {
		'./src': {
			branches: 98,
			functions: 98,
			lines: 90,
			statements: 90,
		},
	},
	displayName: 'unit-tests',
	globals: {
		jsdom: true,
	},
	moduleDirectories: ['node_modules'],
	rootDir: './',
	testEnvironmentOptions: {
		url: 'http://fake-domain.test',
	},
	testMatch: [
		'<rootDir>/src/**/__tests__/**/*.js',
		'<rootDir>/src/__tests__/**/*.js',
	],
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/(?!@?lit.*/)'],
};
