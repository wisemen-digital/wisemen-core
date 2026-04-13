import type {
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'

export const baseConfig: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {
  isInEditor: false,
  name: 'base',
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    markdown: false,
  },
  ignores: [
    '**/fixtures',
    'dist',
    'node_modules',
  ],
  jsonc: true,
  markdown: false,
  rules: {
    'antfu/consistent-list-newline': 'off',
    'curly': [
      'error',
      'all',
    ],
    'e18e/prefer-spread-syntax': 'off',
    'func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: false,
      },
    ],
    'function-paren-newline': [
      'error',
      'multiline-arguments',
    ],
    'import/order': 'off',
    'max-depth': [
      'error',
      3,
    ],
    'no-implicit-coercion': [
      'error',
    ],
    'no-nested-ternary': 'error',
    'require-await': [
      'error',
    ],
    'style/array-bracket-newline': [
      'error',
      {
        minItems: 1,
        multiline: true,
      },
    ],
    'style/array-element-newline': [
      'error',
      {
        ArrayExpression: 'always',
        ArrayPattern: {
          minItems: 0,
          multiline: true,
        },
      },
    ],

    'style/arrow-parens': [
      'error',
      'always',
    ],
    'style/object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          minProperties: 2,
          multiline: true,
        },
        ImportDeclaration: {
          minProperties: 2,
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 1,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 1,
          multiline: true,
        },
      },
    ],
    'style/object-property-newline': [
      'error',
    ],
    'ts/explicit-function-return-type': 'off',
    'unicorn/consistent-function-scoping': 'error',
    'vue/attributes-order': [
      'error',
      {
        alphabetical: false,
        order: [
          'DEFINITION', // is
          'LIST_RENDERING', // v-for
          'CONDITIONALS', // v-if, v-else-if, v-else, v-show, v-cloak
          'RENDER_MODIFIERS', // v-pre, v-once
          'GLOBAL', // id
          'UNIQUE', // ref, key,
          'SLOT', // slot
          'TWO_WAY_BINDING', // v-model
          'ATTR_DYNAMIC', // v-bind, :foo="bar"
          'ATTR_STATIC', // prop="foo"
          'ATTR_SHORTHAND_BOOL', // boolean props e.g. is-active
          'EVENTS', // @click="foo"
          'CONTENT', // v-html, v-text,
        ],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        multiline: {
          max: 1,
        },
        singleline: {
          max: 1,
        },
      },
    ],
    'vue/max-len': [
      'error',
      {
        code: 120,
        ignoreHTMLAttributeValues: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'vue/no-template-shadow': 'error',

    'vue/no-undef-components': [
      'error',
    ],
    'vue/object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
  },
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },
  typescript: true,
  vue: true,
  yaml: true,
}
