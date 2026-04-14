import { createI18nFactory } from '@wisemen/vue-core-i18n-factory'

export const DEFAULT_ZOD_VALIDATION_CONFIG_I18N = {
  'en-US': {
    'package.zod_validation.invalid_phone_number': 'Invalid phone number',
  },
  'nl-BE': {
    'package.zod_validation.invalid_phone_number': 'Ongeldig telefoonnummer',
  },
} as const

export const zodValidationI18nFactory = createI18nFactory(DEFAULT_ZOD_VALIDATION_CONFIG_I18N)
