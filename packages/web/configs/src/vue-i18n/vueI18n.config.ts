import defu from 'defu'
import type { I18nOptions } from 'vue-i18n'

export const DEFAULT_VUE_I18N_CONFIG: Partial<I18nOptions> = {
  escapeParameter: true,
  fallbackWarn: true,
  legacy: false,
  missingWarn: true,
  warnHtmlMessage: false,
}

interface VueI18nConfig<TLocale extends string, TMessages extends Record<TLocale, Record<string, string>>> {
  defaultLocale: TLocale
  localStorageValue: TLocale | null
  messages: TMessages
}
export function vueI18nConfig<TLocale extends string, TMessages extends Record<TLocale, Record<string, string>>>(
  config: VueI18nConfig<TLocale, TMessages>,
  overrides?: Partial<I18nOptions>,
): I18nOptions {
  return defu(overrides, {
    ...DEFAULT_VUE_I18N_CONFIG,
    fallbackLocale: config.defaultLocale ?? undefined,
    locale: config.localStorageValue ?? config.defaultLocale,
    messages: config.messages as Record<string, Record<string, string>>,
  }) as I18nOptions
}
