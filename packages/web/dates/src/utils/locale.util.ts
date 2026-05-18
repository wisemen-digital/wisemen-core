import type { Locale } from '#models/locale.model.ts'

export class LocaleUtil {
  static getCurrentLocale(): Locale {
    const language = typeof navigator !== 'undefined' ? navigator.language : undefined

    return Intl.DateTimeFormat(language).resolvedOptions().locale
  }
}
