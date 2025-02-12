import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules', 'dist', 'build']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    plugins: {
      prettier: eslintPluginPrettier
    }
  },
  {
    rules: {
      ...tseslint.configs.recommended.rules,
      ...eslintConfigPrettier.rules, // Отключает правила ESLint, конфликтующие с Prettier
      'prettier/prettier': 'error' // Ошибки Prettier будут отображаться в ESLint
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  }
]
