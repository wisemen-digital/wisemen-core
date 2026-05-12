import type { Locale } from '#models/locale.model.ts'

export class LocaleUtil {
  static getCurrentLocale(): Locale {
    return Intl.DateTimeFormat(navigator.language).resolvedOptions().locale
  }
}
