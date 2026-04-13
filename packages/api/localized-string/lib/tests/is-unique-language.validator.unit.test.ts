import { describe, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { IsUniqueLanguage } from '#src/validators/is-unique-language.js'
import { LocalizedStringItemCommand } from '#src/localized-string.command.js'

class TestDto {
  @IsUniqueLanguage()
  items: LocalizedStringItemCommand[]
}

describe('IsUniqueLanguage validator', () => {
  describe('valid cases', () => {
    it('validates when all languages are unique', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr', value: 'Bonjour' },
          { locale: 'de', value: 'Hallo' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates when there is only one language', async () => {
      const dto = plainToInstance(TestDto, {
        items: [{ locale: 'en', value: 'Hello' }]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates when items array is empty', async () => {
      const dto = plainToInstance(TestDto, {
        items: []
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })

    it('validates with many unique languages', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr', value: 'Bonjour' },
          { locale: 'de', value: 'Hallo' },
          { locale: 'es', value: 'Hola' },
          { locale: 'it', value: 'Ciao' },
          { locale: 'nl', value: 'Hallo' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(0)
    })
  })

  describe('invalid cases', () => {
    it('fails when a language is duplicated', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr', value: 'Bonjour' },
          { locale: 'en', value: 'Hi' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
      expect(errors[0].constraints).toEqual({
        isUniqueLanguage: 'items must contain unique languages only'
      })
    })

    it('fails when multiple languages are duplicated', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'fr', value: 'Bonjour' },
          { locale: 'en', value: 'Hi' },
          { locale: 'fr', value: 'Salut' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
      expect(errors[0].constraints).toEqual({
        isUniqueLanguage: 'items must contain unique languages only'
      })
    })

    it('fails when same language appears three times', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'en', value: 'Hi' },
          { locale: 'en', value: 'Hey' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
    })

    it('fails when items is not an array', async () => {
      const dto = plainToInstance(TestDto, {
        items: 'not an array' as unknown as LocalizedStringItemCommand[]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
    })

    it('fails when items is null', async () => {
      const dto = plainToInstance(TestDto, {
        items: null as unknown as LocalizedStringItemCommand[]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
    })

    it('fails when items is undefined', async () => {
      const dto = plainToInstance(TestDto, {
        items: undefined as unknown as LocalizedStringItemCommand[]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('items')
    })
  })

  describe('edge cases', () => {
    it('handles case-sensitive language codes', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en', value: 'Hello' },
          { locale: 'EN', value: 'Hi' }
        ]
      })

      const errors = await validate(dto)

      // Different cases are treated as different languages
      expect(errors.length).toBe(0)
    })

    it('handles language codes with regions', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: 'en-US', value: 'Hello' },
          { locale: 'en-GB', value: 'Hello' },
          { locale: 'en-US', value: 'Hi' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
    })

    it('handles empty string languages', async () => {
      const dto = plainToInstance(TestDto, {
        items: [
          { locale: '', value: 'Hello' },
          { locale: '', value: 'Hi' }
        ]
      })

      const errors = await validate(dto)

      expect(errors.length).toBe(1)
    })
  })
})
