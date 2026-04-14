import { createI18nFactory } from './factory'

const DEFAULT_LOCALES = {
  'en-US': {
    invalid_uuid: 'Invalid UUID',
    invalid_date: 'Invalid date',
    required: 'This field is required',
  },
  'nl-BE': {
    invalid_uuid: 'Ongeldige UUID',
    invalid_date: 'Ongeldige datum',
    required: 'Dit veld is verplicht',
  },
} as const

const factory = createI18nFactory(DEFAULT_LOCALES)

// ✅ VALID: No-arg call keeps default locale keys and literal values
const _noConfig = factory.getTranslations()
const _assertNoConfigEnUsInvalidUuid: 'Invalid UUID' = _noConfig['en-US'].invalid_uuid
const _assertNoConfigNlBeRequired: 'Dit veld is verplicht' = _noConfig['nl-BE'].required

// ✅ VALID: All valid keys in extendedLocales
const _validExtendedLocales = factory.getTranslations({
  extendedLocales: {
    'es-ES': {
      invalid_uuid: 'UUID inválido',
      invalid_date: 'Fecha inválida',
      required: 'Campo requerido',
    },
  },
})

// ✅ VALID: Partial overrides for en-US
const _validPartialOverride = factory.getTranslations({
  overrideDefaults: {
    'en-US': {
      invalid_date: 'Custom invalid date message',
    },
  },
})

// ✅ VALID: Empty overrides
const _validEmptyOverride = factory.getTranslations({
  overrideDefaults: {
    'en-US': {},
    'nl-BE': {},
  },
})

// ✅ VALID: Both overrides and extensions
const _validBoth = factory.getTranslations({
  extendedLocales: {
    'fr-FR': {
      invalid_uuid: 'UUID invalide',
      invalid_date: 'Date invalide',
      required: 'Champ requis',
    },
  },
  overrideDefaults: {
    'en-US': {
      invalid_date: 'Custom date',
    },
  },
})

// ❌ INVALID: Extra key 'blabla' in extendedLocales
// @ts-expect-error - 'blabla' is not a valid key
export const invalidExtraKeyInExtended = factory.getTranslations({
  extendedLocales: {
    'es-ES': {
      invalid_uuid: 'UUID inválido',
      invalid_date: 'Fecha inválida',
      blabla: 'invalid key',
      required: 'Campo requerido',
    },
  },
})

// ❌ INVALID: Missing required key in extendedLocales
// @ts-expect-error - missing 'required' key
export const invalidMissingKeyInExtended = factory.getTranslations({
  extendedLocales: {
    'es-ES': {
      invalid_uuid: 'UUID inválido',
      invalid_date: 'Fecha inválida',
    },
  },
})

// ❌ INVALID: Extra key in overrideDefaults
// @ts-expect-error - 'blabla' is not a valid key in en-US
export const invalidExtraKeyInOverride = factory.getTranslations({
  overrideDefaults: {
    'en-US': {
      invalid_date: 'Custom date',
      blabla: 'invalid key',
    },
  },
})

// ❌ INVALID: Invalid locale in overrideDefaults
// @ts-expect-error - 'fr-FR' is not a default locale
export const invalidLocaleInOverride = factory.getTranslations({
  overrideDefaults: {
    'fr-FR': {
      invalid_uuid: 'UUID invalide',
    },
  },
})
