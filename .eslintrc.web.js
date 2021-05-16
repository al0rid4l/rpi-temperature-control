'use strict'
module.exports = {
  root: true,
	env: {
		es2021: true,
		browser: true,
		node: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		lib: ['es2020'], // 和tsconfig的lib一致
		project: './tsconfig.json',
		tsconfigRootDir: './'
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	rules: {
		'no-undef': 'error',
		'no-console': 'off',
		'no-debugger': 'off',
		'no-extra-boolean-cast': 'off',
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1
			}
		],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', {
			avoidEscape: true
		}],
		semi: ['error', 'always'],
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true
			}
		],
		'no-unused-vars': [
			'error',
			{
				vars: 'local',
				args: 'none'
			}
		],
		camelcase: [
			'error',
			{
				properties: 'always',
				ignoreDestructuring: true
			}
		],
		'brace-style': [
			'warn',
			'1tbs',
			{
				allowSingleLine: true
			}
		],
		'comma-dangle': ['warn', 'never'],
		'comma-style': ['warn', 'last'],
		'comma-spacing': [
			'error',
			{
				before: false,
				after: true
			}
		],
		radix: 'warn',
		strict: ['error', 'global'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'arrow-parens': ['error', 'as-needed'],
		// for ts
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': ['warn', {
			allowArgumentsExplicitlyTypedAsAny: true
		}]
	}
};
