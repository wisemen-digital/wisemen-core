import type {
  ComputeMerged,
  DefaultLocaleOverrides,
  ExtendedLocales,
  StrictDefaultOverrides,
  StrictExtendedLocales,
} from './types'

/**
 * Type for the locale factory returned by createI18nFactory
 * Supports partial overrides for default locales and full specs for new locales
 */
export interface I18nFactory<
  TMessages extends Record<string, Record<string, string>>,
> {
  /**
   * Get translations with optional overrides and extensions
   * - overrideDefaults: partial overrides for default locales (individual keys can be customized)
   * - extendedLocales: new locales with complete translation dictionaries (all keys required)
   * Returns a readonly object with literal string types preserved
   */
  getTranslations: {
    (): ComputeMerged<TMessages>
    <TDefaultOverrides extends DefaultLocaleOverrides<TMessages>>(config: {
      extendedLocales?: never
      overrideDefaults: TDefaultOverrides & StrictDefaultOverrides<TMessages, TDefaultOverrides>
    }): ComputeMerged<TMessages, TDefaultOverrides>
    <TExtendedLocales extends ExtendedLocales<TMessages>>(config: {
      extendedLocales: TExtendedLocales & StrictExtendedLocales<TMessages, TExtendedLocales>
      overrideDefaults?: never
    }): ComputeMerged<TMessages, Record<string, never>, TExtendedLocales>
    <
      TDefaultOverrides extends DefaultLocaleOverrides<TMessages>,
      TExtendedLocales extends ExtendedLocales<TMessages>,
    >(config: {
      extendedLocales: TExtendedLocales & StrictExtendedLocales<TMessages, TExtendedLocales>
      overrideDefaults: TDefaultOverrides & StrictDefaultOverrides<TMessages, TDefaultOverrides>
    }): ComputeMerged<TMessages, TDefaultOverrides, TExtendedLocales>
  }
}

/**
 * Creates a i18n factory with smart override handling and strict key validation
 *
 * @example
 * ```ts
 * // Create factory with translations
 * const i18nFactory = createI18nFactory({
 *   'en-US': { 'validation.required': 'This field is required' },
 *   'nl-BE': { 'validation.required': 'Dit veld is verplicht' }
 * })
 *
 * // Get all translations
 * const translations = i18nFactory.getTranslations()
 *
 * // Partial overrides for default locales only
 * const overridden = i18nFactory.getTranslations({
 *   overrideDefaults: {
 *     'en-US': { 'validation.required': 'Custom message' } // partial, other keys from defaults used
 *   }
 * })
 *
 * // Add new locale with all required keys
 * const extended = i18nFactory.getTranslations({
 *   extendedLocales: {
 *     'es-ES': { 'validation.required': 'Mensaje personalizado' } // must include all keys
 *   }
 * })
 *
 * // Combine both overrides and extensions
 * const combined = i18nFactory.getTranslations({
 *   overrideDefaults: {
 *     'en-US': { 'validation.required': 'Custom message' }
 *   },
 *   extendedLocales: {
 *     'es-ES': { 'validation.required': 'Mensaje personalizado' }
 *   }
 * })
 * ```
 */
export function createI18nFactory<
  TMessages extends Record<string, Record<string, string>>,
>(
  messages: TMessages,
): I18nFactory<TMessages> {
  const defaultLocales = new Set(Object.keys(messages) as (keyof TMessages & string)[])

  return {
    /**
     * Get translations with overrides and extensions applied
     * Merges partial overrides with defaults for known locales
     * Includes completely specified new locales
     */
    getTranslations(
      config?: Record<string, any>,
    ): any {
      const overrideDefaults = config?.overrideDefaults
      const extendedLocales = config?.extendedLocales

      const result = {} as any

      // Handle default locales (merge with defaults)
      for (const locale of defaultLocales) {
        result[locale as keyof TMessages] = Object.freeze({
          ...messages[locale],
          ...overrideDefaults?.[locale as keyof TMessages],
        })
      }

      // Handle extended locales (no defaults to merge)
      if (extendedLocales) {
        for (const locale of Object.keys(extendedLocales)) {
          result[locale] = Object.freeze(
            extendedLocales[locale as keyof typeof extendedLocales],
          )
        }
      }

      return Object.freeze(result)
    },
  }
}
