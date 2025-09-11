import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import standard from 'eslint-config-love'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  standard,

  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/*.config.js',
      "**/gql-types.ts",
      "**/db-schema.ts"
    ]
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'eslint-comments/require-description': 'off',
      'arrow-body-style': 'off',
      'promise/avoid-new': 'off',
      'no-console': 'off',
      'max-nested-callbacks': ['error', { max: 5 }],

      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',

      // Core stylistic formatting
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],

      // Function / parameter formatting
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/function-call-spacing': ['error', 'never'],

      // Braces and spacing
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',

      // Alignment and readability
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }]
    }
  },

  {
    files: ['packages/shared/**/*.ts']
  },

  {
    files: ['packages/server/**/*.ts']
  },

  {
    files: ['packages/workers/**/*.ts']
  }
]
