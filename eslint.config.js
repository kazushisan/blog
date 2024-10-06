import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
  },
  {
    ignores: ['dist'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prefer-template': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
);
