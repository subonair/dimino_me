import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base: ignore patterns
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'public/', '*.min.js'],
  },
  // All JS/TS files
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Astro files
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {},
  },
  // Prettier must be last
  prettierConfig,
);
