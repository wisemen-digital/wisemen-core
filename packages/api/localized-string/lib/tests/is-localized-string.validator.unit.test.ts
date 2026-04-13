import { describe, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { IsLocalizedString } from '#src/validators/is-localized-string.js'
import { LocalizedStringCommand, LocalizedStringItemCommand } from '#src/localized-string.command.js'

class TestDtoNoOptions {
  @IsLocalizedString()
  title: LocalizedStringCommand
}

class TestDtoRequiredLanguages {
  @IsLocalizedString({
    requiredLanguages: ['en', 'fr']
  })
  title: LocalizedStringCommand
}

class TestDtoForbidNonRequired {
  @IsLocalizedString({
    requiredLanguages: ['en', 'fr'],
    forbidNonRequiredLanguages: true
  })
  title: LocalizedStringCommand
}

class TestDtoOnlyRequired {
  @IsLocalizedString({
    requiredLanguages: ['en']
  })
  title: LocalizedStringCommand
}

describe('IsLocalizedString validator', () => {
  describe('basic validation without options', () => {
    it('validates a valid localized string', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = plainToInstance(LocalizedStringCommand, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr', value: 'Bonjour' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates with single language', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = plainToInstance(LocalizedStringCommand, {
        items: [{ locale: 'en', value: 'Hello' }]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates with empty items array', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = plainToInstance(LocalizedStringCommand, { items: [] })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('fails when value is null', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = null as unknown as LocalizedStringCommand

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails when value is undefined', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = undefined as unknown as LocalizedStringCommand

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails when items is not an array', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = plainToInstance(LocalizedStringCommand, {
        items: 'not an array' as unknown as LocalizedStringItemCommand[]
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('required languages validation', () => {
    it('validates when all required languages are present', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates when required languages plus extras are present', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' },
            { locale: 'de', value: 'Hallo' },
            { locale: 'es', value: 'Hola' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('fails when a required language is missing', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'de', value: 'Hallo' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)

      const titleError = errors.find(e => e.property === 'title')

      expect(titleError).toBeDefined()
      expect(titleError?.constraints?.isLocalizedString).toContain('en, fr')
    })

    it('fails when all required languages are missing', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [
            { locale: 'de', value: 'Hallo' },
            { locale: 'es', value: 'Hola' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails when items array is empty and languages are required', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: []
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('validates with only one required language present', async () => {
      const dto = plainToInstance(TestDtoOnlyRequired, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })
  })

  describe('forbid non-required languages validation', () => {
    it('validates when exactly required languages are present', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates when required languages are in different order', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'fr', value: 'Bonjour' },
            { locale: 'en', value: 'Hello' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('fails when non-required language is present', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' },
            { locale: 'de', value: 'Hallo' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)

      const titleError = errors.find(e => e.property === 'title')

      expect(titleError).toBeDefined()
      expect(titleError?.constraints?.isLocalizedString).toContain('exactly')
    })

    it('fails when only non-required languages are present', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'de', value: 'Hallo' },
            { locale: 'es', value: 'Hola' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails when required language is missing and extra is present', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'de', value: 'Hallo' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('nested validation', () => {
    it('validates nested LocalizedStringCommand structure', async () => {
      const dto = plainToInstance(TestDtoNoOptions, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('fails when nested items have invalid structure', async () => {
      const dto = plainToInstance(TestDtoNoOptions, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 123, value: 'Invalid' } as unknown as LocalizedStringItemCommand
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails when nested items are missing required fields', async () => {
      const dto = new TestDtoNoOptions()

      dto.title = plainToInstance(LocalizedStringCommand, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr' } as unknown as LocalizedStringItemCommand
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('handles duplicate languages in combination with required languages', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' },
            { locale: 'en', value: 'Hi' }
          ]
        }
      })

      const errors = await validate(dto)

      // Should fail due to duplicate language (IsUniqueLanguage validator)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('handles empty string values', async () => {
      const dto = plainToInstance(TestDtoNoOptions, {
        title: {
          items: [
            { locale: 'en', value: '' },
            { locale: 'fr', value: '' }
          ]
        }
      })

      const errors = await validate(dto)

      // Empty values are allowed by the validator
      expect(errors.length).toBe(0)
    })

    it('handles special characters in locale codes', async () => {
      const dto = plainToInstance(TestDtoNoOptions, {
        title: {
          items: [
            { locale: 'en-US', value: 'Hello' },
            { locale: 'zh-Hans-CN', value: '你好' }
          ]
        }
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })
  })

  describe('error messages', () => {
    it('provides correct error message for missing required languages', async () => {
      const dto = plainToInstance(TestDtoRequiredLanguages, {
        title: {
          items: [{ locale: 'de', value: 'Hallo' }]
        }
      })

      const errors = await validate(dto)

      const titleError = errors.find(e => e.property === 'title')

      expect(titleError?.constraints?.isLocalizedString).toBe(
        'title must contain the following languages: en, fr'
      )
    })

    it('provides correct error message when non-required languages are forbidden', async () => {
      const dto = plainToInstance(TestDtoForbidNonRequired, {
        title: {
          items: [
            { locale: 'en', value: 'Hello' },
            { locale: 'fr', value: 'Bonjour' },
            { locale: 'de', value: 'Hallo' }
          ]
        }
      })

      const errors = await validate(dto)

      const titleError = errors.find(e => e.property === 'title')

      expect(titleError?.constraints?.isLocalizedString).toBe(
        'title must contain exactly these languages: en, fr'
      )
    })
  })
})
