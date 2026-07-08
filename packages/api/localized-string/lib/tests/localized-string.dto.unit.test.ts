import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '#src/localized-string.js'
import { LocalizedStringDto, LocalizedStringItemDto } from '#src/localized-string.dto.js'

describe('LocalizedStringDto', () => {
  describe('from', () => {
    it('creates the transport shape from a LocalizedString', () => {
      const localizedString = new LocalizedString([
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ])

      const dto = LocalizedStringDto.from(localizedString)

      expect(dto).toBeInstanceOf(LocalizedStringDto)
      expect(dto.items).toEqual([
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ])
    })

    it('creates the transport shape from localized values', () => {
      const dto = LocalizedStringDto.from([
        { locale: 'en', value: 'Hello' }
      ])

      expect(dto.items).toHaveLength(1)
      expect(dto.items[0]).toBeInstanceOf(LocalizedStringItemDto)
      expect(dto.items[0]).toEqual({ locale: 'en', value: 'Hello' })
    })
  })

  describe('parse', () => {
    it('round-trips with from', () => {
      const localizedString = new LocalizedString([
        { locale: 'en', value: 'Hello' },
        { locale: 'fr', value: 'Bonjour' }
      ])

      const dto = LocalizedStringDto.from(localizedString)

      expect(dto.parse().toJSON()).toEqual(localizedString.toJSON())
    })
  })
})
