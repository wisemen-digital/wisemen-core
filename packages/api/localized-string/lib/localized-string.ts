export interface LocalizedValue {
  locale: string
  value: string
}

export type MissingTranslationBehavior = 'empty' | 'throw'

export interface TranslateOptions {
  /**
   * Locales to fall back on when the current or requested locale does not have a valid translation.
   * The fallback locales are applied in order.
  */
  fallbackLocales?: string[]
  /**
   * Overwrite the behavior when no translation is found, either `'empty'` for an empty string
   * or `'throw'` to throw an error.
   */
  missingTranslationBehavior?: MissingTranslationBehavior
}

export class MissingTranslationError extends Error {
  constructor (locale: string, availableLocales: string[]) {
    super(`No translation found for locale "${locale}". Available locales: ${availableLocales.join(', ')}`)
    this.name = 'MissingTranslationError'
  }
}

let CURRENT_LOCALE: () => string = () => {
  throw new Error('LocalizedString not initialized: call `initLocalizedString(...)` before using '
    + 'LocalizedString.translate()')
}
let MISSING_TRANSLATION_BEHAVIOR: MissingTranslationBehavior

export function initLocalizedString (options: {
  currentLocale: () => string
  missingTranslationBehavior?: MissingTranslationBehavior
}) {
  CURRENT_LOCALE = options.currentLocale
  MISSING_TRANSLATION_BEHAVIOR = options.missingTranslationBehavior ?? 'empty'
}

export class LocalizedString {
  constructor (
    private values: LocalizedValue[]
  ) {}

  /**
   * Translate the localized string with comprehensive fallback chain:
   * 1. Try exact locale match (e.g., 'en-US')
   * 2. Try base locale (e.g., 'en-US' → 'en')
   * 3. Try each fallback locale in order
   * 4. Handle missing translation based on configured behavior:
   *    - 'empty': return empty string (default)
   *    - 'throw': throw MissingTranslationError
   *
   * @param locale - The locale to translate to. If not provided, uses current locale
   * @param options - Translation options including fallback locales
   * and missing translation behavior
   * @returns The translated string
   * @throws {MissingTranslationError} When no translation found and behavior is 'throw'
   */
  translate (locale?: string, options?: TranslateOptions): string {
    const requestedLocale = locale ?? CURRENT_LOCALE()
    const fallbackLocales = options?.fallbackLocales ?? []
    const missingBehavior = options?.missingTranslationBehavior ?? MISSING_TRANSLATION_BEHAVIOR

    const findTranslation = (loc: string): string | undefined => {
      return this.values.find(v => v.locale === loc)?.value
    }

    let translation = findTranslation(requestedLocale)

    if (translation !== undefined) {
      return translation
    }

    // Try base locale (en-US → en)
    if (requestedLocale.includes('-')) {
      const baseLocale = requestedLocale.split('-')[0]

      translation = findTranslation(baseLocale)

      if (translation !== undefined) {
        return translation
      }
    }

    // Try each fallback locale in order
    for (const fallbackLocale of fallbackLocales) {
      translation = findTranslation(fallbackLocale)

      if (translation !== undefined) {
        return translation
      }

      // Also try base of fallback locale if it has a region
      if (fallbackLocale.includes('-')) {
        const baseFallback = fallbackLocale.split('-')[0]

        translation = findTranslation(baseFallback)

        if (translation !== undefined) return translation
      }
    }

    // Handle missing translation based on configured behavior
    return this.handleMissingTranslation(requestedLocale, missingBehavior)
  }

  private handleMissingTranslation (locale: string, behavior: MissingTranslationBehavior): string {
    const availableLocales = this.values.map(v => v.locale)

    switch (behavior) {
      case 'throw': throw new MissingTranslationError(locale, availableLocales)
      case 'empty':
      default:
        return ''
    }
  }

  toJSON (): LocalizedValue[] {
    return this.values
  }
}
