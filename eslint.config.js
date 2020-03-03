import babelParser from '@babel/eslint-parser';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import json from '@eslint/json';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import prettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';

export default defineConfig([
	{
		ignores: [
			'**/dist/*',
			'**/coverage/*',
			'**/.astro/*',
			'docs/**',
			'benchmark/**',
			'examples/**',
			'**/__tests__/*',
		],
	},
	noUnsanitized.configs.recommended,
	security.configs.recommended,
	{
		files: ['**/*.json'],
		ignores: ['package-lock.json'],
		language: 'json/json',
		plugins: { json },
		extends: ['json/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
			},
			globals: {
				...globals.browser,
				...globals.node,
				jest: true,
			},
		},
		plugins: {
			prettier,
		},
		rules: {
			curly: ['error', 'all'],
			eqeqeq: ['error', 'smart'],
			'guard-for-in': 2,
			'no-console':
				process.env.NODE_ENV === 'dev' ||
				process.env.NODE_ENV === 'development' ||
				process.env.NODE_ENV === 'test'
					? 'off'
					: 'error',
			'no-debugger':
				process.env.NODE_ENV === 'dev' ||
				process.env.NODE_ENV === 'development' ||
				process.env.NODE_ENV === 'test'
					? 'off'
					: 'error',
			'no-trailing-spaces': 'error',
			'no-unsanitized/method': 'error',
			'no-unsanitized/property': 'error',
			'no-use-before-define': 'error',
			'prettier/prettier': 'warn',
			quotes: [
				'error',
				'single',
				{
					allowTemplateLiterals: true,
					avoidEscape: true,
				},
			],
			radix: ['error', 'always'],
			semi: ['error', 'always'],
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: false,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				},
			],
			'wrap-iife': ['error', 'outside', { functionPrototypeMethods: true }],

			'security/detect-buffer-noassert': 1, // **
			'security/detect-child-process': 1, // **
			'security/detect-disable-mustache-escape': 1, // **
			'security/detect-eval-with-expression': 1, // **
			'security/detect-new-buffer': 1, // **
			'security/detect-no-csrf-before-method-override': 1, // **
			'security/detect-non-literal-fs-filename': 1, // **
			'security/detect-non-literal-regexp': 1, // **
			'security/detect-non-literal-require': 1, // **
			'security/detect-object-injection': 1, // **
			'security/detect-possible-timing-attacks': 1, // **
			'security/detect-pseudoRandomBytes': 1, // **
			'security/detect-unsafe-regex': 1, // **
		},
	},
	{
		// Build tooling: dynamic fs access and logging are expected here.
		files: ['**/scripts/**/*.{js,mjs,cjs}'],
		rules: {
			'no-console': 'off',
			'sort-imports': 'off',
			'security/detect-non-literal-fs-filename': 'off',
		},
	},
]);
