import js from '@eslint/js';
import tsdoc from 'eslint-plugin-tsdoc';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'playwright-report',
      'test-results',
      'scripts',
      'site',
      '.venv',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
      globals: { document: 'readonly', window: 'readonly' },
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { tsdoc },
    rules: { 'tsdoc/syntax': 'error' },
  },
  {
    files: ['playwright.config.ts'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
  // Dependency rule (software architecture, "Import rules"): inside the
  // paradigm bounded context, dependencies point at the domain only. The
  // domain imports nothing; ui never imports infrastructure; shared knows
  // nothing about paradigms. App.vue and main.ts are the composition root
  // and may import anything.
  {
    files: ['src/paradigm/domain/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/paradigm/infrastructure/**',
            '@/paradigm/ui/**',
            '@/shared/**',
            '**/infrastructure/**',
            '**/ui/**',
            '**/shared/**',
          ],
          paths: ['vue'],
        },
      ],
    },
  },
  {
    files: ['src/paradigm/infrastructure/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/paradigm/ui/**', '@/shared/**', '**/ui/**', '**/shared/**'],
          paths: ['vue'],
        },
      ],
    },
  },
  {
    files: ['src/paradigm/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@/paradigm/infrastructure/**', '**/infrastructure/**'] },
      ],
    },
  },
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@/paradigm/**', '**/paradigm/**'] }],
    },
  },
  {
    rules: {
      complexity: ['error', 10],
      'no-nested-ternary': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'vue/html-indent': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
);
