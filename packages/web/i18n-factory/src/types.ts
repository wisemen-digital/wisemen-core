/**
 * Configuration for getTranslations method
 * - overrideDefaults: partial overrides for default locales
 * - extendedLocales: new locales with complete key specification
 */
export interface I18nFactoryConfig<
  TMessages extends Record<string, Record<string, string>>,
> {
  extendedLocales?: ExtendedLocales<TMessages>
  overrideDefaults?: DefaultLocaleOverrides<TMessages>
}

/**
 * Extract all unique keys from all locale translation objects
 */
export type AllTranslationKeys<T extends Record<string, Record<string, string>>>
  = T[keyof T] extends Record<infer K, string> ? K : never

/**
 * Partial overrides for default locales
 * All default locales must be specified (can be empty objects to skip overriding)
 * Only allows overriding keys that exist in the default locale
 */
/**
 * Extract the keys from the first/main locale for validation
 */
type MainLocaleKeys<T extends Record<string, Record<string, string>>> = keyof T[keyof T]

/**
 * Partial overrides for default locales
 * Only allows keys that exist in that specific locale
 */
export type DefaultLocaleOverrides<
  TMessages extends Record<string, Record<string, string>>,
> = {
  [K in keyof TMessages]?: {
    [KeyName in keyof TMessages[K]]?: string
  }
}

/**
 * New locales with complete key specification
 * Each new locale must provide ALL keys from the default locales
 */
export type ExtendedLocales<
  TMessages extends Record<string, Record<string, string>>,
> = Record<
  string,
  {
    [K in MainLocaleKeys<TMessages> & string]: string
  }
>

/**
 * Enforces no extra keys in default locale overrides
 */
export type StrictDefaultOverrides<
  TMessages extends Record<string, Record<string, string>>,
  TOverrides,
> = {
  [K in keyof TOverrides]: K extends keyof TMessages
    ? TOverrides[K] & Record<Exclude<keyof TOverrides[K], keyof TMessages[K]>, never>
    : never
}

/**
 * Enforces no extra keys in extended locales
 */
export type StrictExtendedLocales<
  TMessages extends Record<string, Record<string, string>>,
  TExtended,
> = {
  [K in keyof TExtended]: TExtended[K] & Record<Exclude<keyof TExtended[K], MainLocaleKeys<TMessages>>, never>
}

/**
 * Compute merged translations from defaults and overrides
 * Preserves literal types from override parameters (overrides take precedence)
 */
export type ComputeMerged<
  TMessages extends Record<string, Record<string, string>>,
  TDefaultOverrides extends Record<string, any> = Record<never, never>,
  TExtendedLocales extends Record<string, any> = Record<never, never>,
> = Readonly<
  {
    readonly [K in keyof TMessages]: Readonly<
      K extends keyof TDefaultOverrides
        ? Omit<TMessages[K], keyof TDefaultOverrides[K]> & TDefaultOverrides[K]
        : TMessages[K]
    >
  } & {
    readonly [K in keyof TExtendedLocales]: Readonly<TExtendedLocales[K]>
  }
>

/**
 * Merge overrides with defaults to produce final result
 * Returns readonly translation objects for all requested locales
 */
export type MergedOverrides<
  TMessages extends Record<string, Record<string, string>>,
  TAdditional extends Record<string, Record<string, string>> = Record<
    string,
    Record<string, string>
  >,
> = Readonly<
  {
    readonly [K in keyof TMessages]: Readonly<Record<string, string>>
  } & {
    readonly [K in Exclude<
      keyof TAdditional,
      keyof TMessages
    >]: Readonly<Record<string, string>>
  }
>
