import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString, initLocalizedString, MissingTranslationError } from '#src/localized-string.js'

describe('LocalizedString', () => {
  before(() => {
    initLocalizedString({
      currentLocale: () => 'en',
      missingTranslationBehavior: 'empty'
    })
  })

  describe('constructor', () => {
    it('creates a LocalizedString with values', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString).toBeInstanceOf(LocalizedString)
    })

    it('creates a LocalizedString with empty array', () => {
      const localizedString = new LocalizedString([])

      expect(localizedString).toBeInstanceOf(LocalizedString)
    })

    it('creates a LocalizedString with single value', () => {
      const values = [{ locale: 'en', value: 'Hello' }]
      const localizedString = new LocalizedString(values)

      expect(localizedString).toBeInstanceOf(LocalizedString)
    })
  })

  describe('translate with explicit locale', () => {
    it('returns correct translation for existing locale', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' },
        { locale: 'de', value: 'Hallo' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('Hello')
      expect(localizedString.translate('fr')).toBe('Bonjour')
      expect(localizedString.translate('de')).toBe('Hallo')
    })

    it('returns translation for single locale', () => {
      const values = [{ locale: 'en', value: 'Hello' }]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('Hello')
    })

    it('returns empty string when locale not found (default behavior)', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de')).toBe('')
    })

    it('uses fallbackLocales when requested locale not found', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de', { fallbackLocales: ['en'] })).toBe('Hello')
      expect(localizedString.translate('de', { fallbackLocales: ['fr', 'en'] })).toBe('Bonjour')
    })

    it('tries fallback locales in order', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' },
        { locale: 'de', value: 'Hallo' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('es', { fallbackLocales: ['de', 'fr', 'en'] })).toBe('Hallo')
      expect(localizedString.translate('es', { fallbackLocales: ['it', 'fr', 'en'] })).toBe('Bonjour')
    })
  })

  describe('missing translation behaviors', () => {
    it('returns empty string with "empty" behavior (default)', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de')).toBe('')
    })

    it('throws MissingTranslationError with "throw" behavior', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'throw'
      })

      const values = [
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(() => localizedString.translate('de')).toThrow(MissingTranslationError)
      expect(() => localizedString.translate('de')).toThrow('No translation found for locale "de"')
    })

    it('can override missing translation behavior per translate call', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de')).toBe('')
      expect(() => localizedString.translate('de', { missingTranslationBehavior: 'throw' })).toThrow(MissingTranslationError)
    })

    it('handles empty values array gracefully', () => {
      const emptyString = new LocalizedString([])

      expect(emptyString.translate('de', { missingTranslationBehavior: 'empty' })).toBe('')
      expect(() => emptyString.translate('de', { missingTranslationBehavior: 'throw' })).toThrow(MissingTranslationError)
    })
  })

  describe('locale hierarchy (base locale fallback)', () => {
    it('falls back from region-specific to base locale', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en-US')).toBe('Hello')
      expect(localizedString.translate('en-GB')).toBe('Hello')
      expect(localizedString.translate('fr-FR')).toBe('Bonjour')
      expect(localizedString.translate('fr-CA')).toBe('Bonjour')
    })

    it('prefers exact match over base locale', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'en-GB', value: 'Colour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en-GB')).toBe('Colour')
      expect(localizedString.translate('en-US')).toBe('Hello')
    })

    it('tries base locale of fallback locales', () => {
      const values = [
        { locale: 'en', value: 'Hello' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de', { fallbackLocales: ['fr-FR', 'en-US'] })).toBe('Hello')
    })
  })

  describe('translate without locale (current locale)', () => {
    it('returns current locale translation', () => {
      initLocalizedString({
        currentLocale: () => 'fr',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate()).toBe('Bonjour')
    })

    it('returns empty string when current locale not available', () => {
      initLocalizedString({
        currentLocale: () => 'de',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate()).toBe('')
    })

    it('uses current locale from currentLocale function', () => {
      let currentLang = 'en'

      initLocalizedString({
        currentLocale: () => currentLang,
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' },
        { locale: 'de', value: 'Hallo' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate()).toBe('Hello')

      currentLang = 'fr'
      expect(localizedString.translate()).toBe('Bonjour')

      currentLang = 'de'
      expect(localizedString.translate()).toBe('Hallo')
    })

    it('can use fallback locales with current locale', () => {
      initLocalizedString({
        currentLocale: () => 'de',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate(undefined, { fallbackLocales: ['en'] })).toBe('Hello')
    })
  })

  describe('toJSON', () => {
    it('returns the values array', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.toJSON()).toEqual(values)
    })

    it('returns empty array for empty LocalizedString', () => {
      const localizedString = new LocalizedString([])

      expect(localizedString.toJSON()).toEqual([])
    })

    it('returns the same reference to values array', () => {
      const values = [
        { locale: 'en', value: 'Hello' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.toJSON()).toBe(values)
    })

    it('can be used with JSON.stringify', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)
      const json = JSON.stringify(localizedString)

      expect(json).toBe(JSON.stringify(values))
    })
  })

  describe('edge cases', () => {
    it('handles special characters in values', () => {
      const values = [
        { locale: 'en', value: 'Hello, "World"!' },
        { locale: 'fr', value: 'Bonjour, «Monde»!' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('Hello, "World"!')
      expect(localizedString.translate('fr')).toBe('Bonjour, «Monde»!')
    })

    it('handles empty string values', () => {
      const values = [
        { locale: 'en', value: '' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('')
    })

    it('handles unicode and emojis in values', () => {
      const values = [
        { locale: 'en', value: 'Hello 👋' },
        { locale: 'zh', value: '你好' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('Hello 👋')
      expect(localizedString.translate('zh')).toBe('你好')
    })

    it('handles locale codes with regions', () => {
      const values = [
        { locale: 'en-US', value: 'Color' },
        { locale: 'en-GB', value: 'Colour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en-US')).toBe('Color')
      expect(localizedString.translate('en-GB')).toBe('Colour')
    })

    it('handles duplicate locales by using first occurrence', () => {
      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'en', value: 'Hi' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe('Hello')
    })

    it('handles very long translation strings', () => {
      const longString = 'A'.repeat(10000)
      const values = [
        { locale: 'en', value: longString }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('en')).toBe(longString)
    })
  })

  describe('initLocalizedString', () => {
    it('sets currentLocale function correctly', () => {
      let locale = 'en'

      initLocalizedString({
        currentLocale: () => locale,
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate()).toBe('Hello')

      locale = 'fr'
      expect(localizedString.translate()).toBe('Bonjour')
    })

    it('sets global missing translation behavior', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'empty'
      })

      const values = [
        { locale: 'fr', value: 'Bonjour' }
      ]
      const localizedString = new LocalizedString(values)

      expect(localizedString.translate('de')).toBe('')
    })
  })

  describe('multiple LocalizedString instances', () => {
    it('handles multiple instances independently', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'empty'
      })

      const greeting = new LocalizedString([
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ])

      const farewell = new LocalizedString([
        { locale: 'en', value: 'Goodbye' },
        { locale: 'fr', value: 'Au revoir' }
      ])

      expect(greeting.translate('en')).toBe('Hello')
      expect(greeting.translate('fr')).toBe('Bonjour')
      expect(farewell.translate('en')).toBe('Goodbye')
      expect(farewell.translate('fr')).toBe('Au revoir')
    })

    it('applies same initialization to all instances', () => {
      let currentLang = 'en'

      initLocalizedString({
        currentLocale: () => currentLang,
        missingTranslationBehavior: 'empty'
      })

      const string1 = new LocalizedString([
        { locale: 'en', value: 'First' },
        { locale: 'fr', value: 'Premier' }
      ])

      const string2 = new LocalizedString([
        { locale: 'en', value: 'Second' },
        { locale: 'fr', value: 'Deuxième' }
      ])

      expect(string1.translate()).toBe('First')
      expect(string2.translate()).toBe('Second')

      currentLang = 'fr'
      expect(string1.translate()).toBe('Premier')
      expect(string2.translate()).toBe('Deuxième')
    })

    it('can have different fallback strategies per instance', () => {
      initLocalizedString({
        currentLocale: () => 'en',
        missingTranslationBehavior: 'empty'
      })

      const string1 = new LocalizedString([
        { locale: 'fr', value: 'Bonjour' }
      ])

      const string2 = new LocalizedString([
        { locale: 'de', value: 'Hallo' }
      ])

      expect(string1.translate('en', { fallbackLocales: ['fr'] })).toBe('Bonjour')
      expect(string2.translate('en', { fallbackLocales: ['de'] })).toBe('Hallo')
    })
  })
})
