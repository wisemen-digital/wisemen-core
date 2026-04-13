import vueI18n from '@intlify/eslint-plugin-vue-i18n'

import type { LintConfig } from '@/types/lint.type.ts'

export const DEFAULT_I18N_LOCALES_FOLDER_PATH = './src/locales/*.json'
export const i18nConfig: LintConfig = ({
  name: 'vue-i18n',
  plugins: {
    '@intlify/vue-i18n': vueI18n,
  },
  rules: {
    '@intlify/vue-i18n/key-format-style': [
      'error',
      'snake_case',
      {
        splitByDots: true,
      },
    ],
    '@intlify/vue-i18n/no-deprecated-i18n-component': 'error',
    '@intlify/vue-i18n/no-deprecated-i18n-place-attr': 'error',
    '@intlify/vue-i18n/no-deprecated-i18n-places-prop': 'error',
    '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
    '@intlify/vue-i18n/no-dynamic-keys': 'error',
    '@intlify/vue-i18n/no-html-messages': 'error',
    '@intlify/vue-i18n/no-i18n-t-path-prop': 'error',
    '@intlify/vue-i18n/no-missing-keys': 'error',
    '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
    '@intlify/vue-i18n/no-raw-text': 'error',
    '@intlify/vue-i18n/no-unknown-locale': 'error',
    '@intlify/vue-i18n/no-v-html': 'error',
    '@intlify/vue-i18n/prefer-linked-key-with-paren': 'error',
    '@intlify/vue-i18n/valid-message-syntax': 'error',
  },
})
