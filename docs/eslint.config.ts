import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindDisabled: true,
  })),
  {
    rules: {
      'perfectionist/sort-objects': 'off',
      '@intlify/vue-i18n/no-raw-text': 'off',
      'vuejs-accessibility/label-has-for': 'off',
      'project-structure/independent-modules': 'off',
    },
  },
  {
    ignores: [
      '**/public/*',
      '**/scripts/**',
      'postcss.config.mjs',
    ],
  },
]
