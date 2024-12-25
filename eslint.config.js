import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginVueTs from '@vue/eslint-config-typescript';

export default tseslint.config(
  {
    ignores: ['**/dist', '.vitepress/cache'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...pluginVueTs(),
  prettier,
  {
    rules: {
      'prefer-template': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'vue/multi-word-component-names': 'off',
    },
  },
);
