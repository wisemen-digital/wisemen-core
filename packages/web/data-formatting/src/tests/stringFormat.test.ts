import {
  describe,
  expect,
  it,
} from 'vitest'

import { useDataFormatConfig } from '@/composables/config.composable'
import { useStringFormat } from '@/composables/stringFormat.composable'
import { StringFormatUtil } from '@/utils/stringFormat.util'

describe('stringFormatUtil', () => {
  describe('format', () => {
    it('should return the value when it is a non-empty string', () => {
      expect(StringFormatUtil.format('hello')).toBe('hello')
    })

    it('should return the fallback for null', () => {
      expect(StringFormatUtil.format(null)).toBe('-')
    })

    it('should return the fallback for undefined', () => {
      const value: string | undefined = undefined

      expect(StringFormatUtil.format(value)).toBe('-')
    })

    it('should return the fallback for blank strings', () => {
      expect(StringFormatUtil.format('   ')).toBe('-')
    })

    it('should use a custom fallback', () => {
      expect(StringFormatUtil.format(null, 'N/A')).toBe('N/A')
    })
  })

  describe('normalizeWhitespace', () => {
    it('should collapse multiple spaces and trim', () => {
      expect(StringFormatUtil.normalizeWhitespace('  hello   world  ')).toBe('hello world')
    })
  })

  describe('toPrettyUrl', () => {
    it('should strip protocol and www', () => {
      expect(StringFormatUtil.toPrettyUrl('https://www.example.com/')).toBe('example.com')
    })

    it('should strip only the protocol when no www', () => {
      expect(StringFormatUtil.toPrettyUrl('https://example.com')).toBe('example.com')
    })
  })

  describe('toSentenceCase', () => {
    it('should capitalize the first letter of each sentence', () => {
      expect(StringFormatUtil.toSentenceCase('hello world. goodbye world')).toBe('Hello world. Goodbye world')
    })
  })

  describe('toSlug', () => {
    it('should create a URL-friendly slug', () => {
      expect(StringFormatUtil.toSlug('Hello Wörld!')).toBe('hello-world')
    })

    it('should collapse multiple hyphens', () => {
      expect(StringFormatUtil.toSlug('hello   world')).toBe('hello-world')
    })
  })

  describe('toTitleCase', () => {
    it('should capitalize each word', () => {
      expect(StringFormatUtil.toTitleCase('hello world')).toBe('Hello World')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(StringFormatUtil.truncate('Hello world', 8)).toBe('Hello w…')
    })

    it('should not truncate short strings', () => {
      expect(StringFormatUtil.truncate('Hello', 10)).toBe('Hello')
    })
  })

  describe('truncateMiddle', () => {
    it('should truncate from the middle', () => {
      expect(StringFormatUtil.truncateMiddle('Hello world', 8)).toBe('Hell…rld')
    })

    it('should not truncate short strings', () => {
      expect(StringFormatUtil.truncateMiddle('Hello', 10)).toBe('Hello')
    })
  })
})

describe('useStringFormat', () => {
  describe('toList', () => {
    it('should format items as a conjunction list', () => {
      useDataFormatConfig().update({
        locale: 'en',
      })

      const {
        toList,
      } = useStringFormat()

      expect(toList([
        'a',
        'b',
        'c',
      ])).toBe('a, b, and c')
    })

    it('should format items as a disjunction list', () => {
      useDataFormatConfig().update({
        locale: 'en',
      })

      const {
        toList,
      } = useStringFormat()

      expect(toList([
        'a',
        'b',
        'c',
      ], 'disjunction')).toBe('a, b, or c')
    })
  })

  describe('compare', () => {
    it('should return a locale-aware comparator', () => {
      useDataFormatConfig().update({
        locale: 'en',
      })

      const {
        compare,
      } = useStringFormat()

      const sorted = [
        'banana',
        'apple',
        'cherry',
      ].sort(compare())

      expect(sorted).toEqual([
        'apple',
        'banana',
        'cherry',
      ])
    })
  })
})
