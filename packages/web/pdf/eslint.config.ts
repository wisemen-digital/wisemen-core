import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
  {
    rules: {
      '@intlify/vue-i18n/no-raw-text': 'off',
    },
  },
]
