import { createI18n } from 'vue-i18n'

import enUs from '@/locales/en-US.json'
import nlBe from '@/locales/nl-BE.json'

const messages = {
  en: {
    ...enUs,
  },
  nl: {
    ...nlBe,
  },
}

export const i18nPlugin = createI18n({
  escapeParameter: true,
  fallbackLocale: 'en',
  fallbackWarn: true,
  legacy: false,
  locale: 'en',
  messages,
  missingWarn: true,
  warnHtmlInMessage: false,
  warnHtmlMessage: false,
})
