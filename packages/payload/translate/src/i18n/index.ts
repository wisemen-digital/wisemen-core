/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import en from './en.json'
import nl from './nl.json'

export type TranslationKey = keyof typeof en

export function t(key: TranslationKey) {
  return {
    en: en[key],
    nl: nl[key],
  }
}
