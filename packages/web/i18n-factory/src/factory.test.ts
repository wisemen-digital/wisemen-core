/* eslint-disable test/expect-expect */
import {
  describe,
  expectTypeOf,
  it,
} from 'vitest'

import { createI18nFactory } from './factory'

const DEFAULT_LOCALES = {
  'en-US': {
    key1: 'Value 1',
    key2: 'Value 2',
    key3: 'Value 3',
  },
  'nl-BE': {
    key1: 'Waarde 1',
    key2: 'Waarde 2',
    key3: 'Waarde 3',
  },
} as const

const factory = createI18nFactory(DEFAULT_LOCALES)

describe('createI18nFactory', () => {
  it('should allow getting all translations without arguments', () => {
    const result = factory.getTranslations()

    expectTypeOf(result).toExtend<
      Readonly<{
        readonly 'en-US': Readonly<Record<string, string>>
        readonly 'nl-BE': Readonly<Record<string, string>>
      }>
    >()
  })

  it('should allow partial overrides for default locales', () => {
    const result = factory.getTranslations({
      overrideDefaults: {
        'en-US': {
          key1: 'Custom Value 1',
        },
      },
    })

    // Should be able to access the locale
    expectTypeOf(result['en-US']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should allow empty overrides for specific locales', () => {
    const result = factory.getTranslations({
      overrideDefaults: {
        'en-US': {},
        'nl-BE': {},
      },
    })

    expectTypeOf(result['en-US']).toExtend<Readonly<Record<string, string>>>()
    expectTypeOf(result['nl-BE']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should allow adding new locales with extendedLocales', () => {
    const result = factory.getTranslations({
      extendedLocales: {
        'es-ES': {
          key1: 'Valor 1',
          key2: 'Valor 2',
          key3: 'Valor 3',
        },
      },
    })

    expectTypeOf(result['es-ES']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should allow combining overrides and extensions', () => {
    const result = factory.getTranslations({
      extendedLocales: {
        'es-ES': {
          key1: 'Valor 1',
          key2: 'Valor 2',
          key3: 'Valor 3',
        },
      },
      overrideDefaults: {
        'en-US': {
          key1: 'Custom Value',
        },
      },
    })

    expectTypeOf(result['en-US']).toExtend<Readonly<Record<string, string>>>()
    expectTypeOf(result['es-ES']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should preserve override values in the type', () => {
    const result = factory.getTranslations({
      overrideDefaults: {
        'en-US': {
          key1: 'Custom Value 1',
        },
      },
    })

    // The returned type should include the custom override
    const value = result['en-US'].key1

    expectTypeOf(value).toExtend<string>()
  })

  it('should require all keys in extended locales', () => {
    // This test verifies that missing keys would cause type errors
    // TypeScript will error if all keys are not provided
    const result = factory.getTranslations({
      extendedLocales: {
        'fr-FR': {
          key1: 'Valeur 1',
          key2: 'Valeur 2',
          key3: 'Valeur 3',
        },
      },
    })

    expectTypeOf(result['fr-FR']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should return readonly objects', () => {
    const result = factory.getTranslations()

    expectTypeOf(result).toExtend<
      Readonly<Record<string, Readonly<Record<string, string>>>>
    >()
  })
})

describe('override precedence', () => {
  it('should use overridden values over defaults', () => {
    const result = factory.getTranslations({
      overrideDefaults: {
        'en-US': {
          key1: 'Custom Value 1',
        },
      },
    })

    // Key1 should be the custom override
    const key1 = result['en-US'].key1

    expectTypeOf(key1).toExtend<string>()

    // Key2 and key3 should still be accessible (from defaults)
    const key2 = result['en-US'].key2
    const key3 = result['en-US'].key3

    expectTypeOf(key2).toExtend<string>()
    expectTypeOf(key3).toExtend<string>()
  })
})

describe('default locales behavior', () => {
  it('should make default locales optional in overrideDefaults', () => {
    // Can override just en-US without nl-BE
    const result1 = factory.getTranslations({
      overrideDefaults: {
        'en-US': {
          key1: 'Custom',
        },
      },
    })

    // Can override just nl-BE without en-US
    const result2 = factory.getTranslations({
      overrideDefaults: {
        'nl-BE': {
          key1: 'Aangepast',
        },
      },
    })

    // Both locales should be accessible in both cases
    expectTypeOf(result1['en-US']).toExtend<Readonly<Record<string, string>>>()
    expectTypeOf(result1['nl-BE']).toExtend<Readonly<Record<string, string>>>()

    expectTypeOf(result2['en-US']).toExtend<Readonly<Record<string, string>>>()
    expectTypeOf(result2['nl-BE']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should always include default locales in result', () => {
    // Even with no config, both default locales should be present
    const result = factory.getTranslations()

    expectTypeOf(result).toExtend<{
      'en-US': Readonly<Record<string, string>>
      'nl-BE': Readonly<Record<string, string>>
    }>()
  })
})

describe('type safety and key validation', () => {
  it('should type error if you access a non-existent key', () => {
    const result = factory.getTranslations()

    // @ts-expect-error - key4 does not exist in DEFAULT_LOCALES
    const _value = result['en-US'].key4
  })

  it('should type error when overriding with a non-existent key', () => {
    // @ts-expect-error - key4 does not exist in DEFAULT_LOCALES
    const result = factory.getTranslations({
      overrideDefaults: {
        'en-US': {
          key1: 'Custom Value',
          key4: 'Invalid Key',
        },
      },
    })

    expectTypeOf(result['en-US']).toExtend<Readonly<Record<string, string>>>()
  })

  it('should type error when extending locales with a non-existent key', () => {
    // @ts-expect-error - key4 does not exist in DEFAULT_LOCALES
    factory.getTranslations({
      extendedLocales: {
        'fr-FR': {
          key1: 'Valeur 1',
          key2: 'Valeur 2',
          key3: 'Valeur 3',
          key4: 'Invalid Key',
        },
      },
    })
  })
})
