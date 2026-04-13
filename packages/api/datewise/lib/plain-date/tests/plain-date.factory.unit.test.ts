import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '../../common/init-dayjs.js'
import { factory } from '../plain-date.factory.js'
import { DayjsPlainDate } from '../dayjs-plain-date.js'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { PastInfinityDate } from '../past-infinity-date.js'
import { plainDate } from '../index.js'

describe('PlainDate factory', () => {
  before(() => initDayjs())

  describe('no argument', () => {
    it('returns a WiseDate representing today', () => {
      const result = factory()

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.isSame(plainDate.today())).toBe(true)
    })
  })

  describe('undefined argument', () => {
    it('returns a WiseDate representing today', () => {
      const result = factory(undefined)

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.isSame(plainDate.today())).toBe(true)
    })
  })

  describe('null argument', () => {
    it('returns null', () => {
      const result = factory(null)

      expect(result).toBe(null)
    })
  })

  describe('infinity string arguments', () => {
    it('returns FutureInfinityDate for "infinity"', () => {
      const result = factory('infinity')

      expect(result).toBeInstanceOf(FutureInfinityDate)
      expect(result.isFutureInfinity()).toBe(true)
      expect(result.toString()).toBe('infinity')
    })

    it('returns PastInfinityDate for "-infinity"', () => {
      const result = factory('-infinity')

      expect(result).toBeInstanceOf(PastInfinityDate)
      expect(result.isPastInfinity()).toBe(true)
      expect(result.toString()).toBe('-infinity')
    })

    it('returns FutureInfinityDate for "+infinity"', () => {
      const result = factory('+infinity')

      expect(result).toBeInstanceOf(FutureInfinityDate)
      expect(result.isFutureInfinity()).toBe(true)
      expect(result.toString()).toBe('infinity')
    })
  })

  describe('infinity number arguments', () => {
    it('returns FutureInfinityDate for Infinity', () => {
      const result = factory(Infinity)

      expect(result).toBeInstanceOf(FutureInfinityDate)
      expect(result.isFutureInfinity()).toBe(true)
    })

    it('returns PastInfinityDate for -Infinity', () => {
      const result = factory(-Infinity)

      expect(result).toBeInstanceOf(PastInfinityDate)
      expect(result.isPastInfinity()).toBe(true)
    })
  })

  describe('string date arguments', () => {
    it('returns WiseDate for valid date string', () => {
      const result = factory('2024-01-01')

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
    })

    it('returns WiseDate for another valid date string', () => {
      const result = factory('2025-12-25')

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2025-12-25')
    })

    it('throws for invalid date string', () => {
      expect(() => factory('not-a-date')).toThrow()
    })

    it('throws for malformed date string', () => {
      expect(() => factory('2024-13-01')).toThrow()
    })
  })

  describe('number date arguments', () => {
    it('returns WiseDate for valid timestamp', () => {
      const timestamp = new Date('2024-01-01').getTime()
      const result = factory(timestamp)

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
    })

    it('returns WiseDate for zero timestamp (epoch)', () => {
      const result = factory(0)

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('1970-01-01')
    })

    it('returns WiseDate for positive timestamp', () => {
      const timestamp = 1640995200000 // 2022-01-01 00:00:00 UTC
      const result = factory(timestamp)

      expect(result).toBeInstanceOf(DayjsPlainDate)
    })

    it('returns WiseDate for negative timestamp', () => {
      const timestamp = -86400000 // 1969-12-31
      const result = factory(timestamp)

      expect(result).toBeInstanceOf(DayjsPlainDate)
    })
  })

  describe('Date object arguments', () => {
    it('returns WiseDate for Date object', () => {
      const date = new Date('2024-01-01')
      const result = factory(date)

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
    })
  })

  describe('type safety', () => {
    it('maintains correct return types for overloads', () => {
      // These tests verify the TypeScript overloads work correctly
      const nullResult: null = factory(null)
      const undefinedResult: DayjsPlainDate = factory(undefined)
      const noArgResult: DayjsPlainDate = factory()
      const stringResult: DayjsPlainDate = factory('2024-01-01')
      const numberResult: DayjsPlainDate = factory(123456789)

      expect(nullResult).toBe(null)
      expect(undefinedResult).toBeInstanceOf(DayjsPlainDate)
      expect(noArgResult).toBeInstanceOf(DayjsPlainDate)
      expect(stringResult).toBeInstanceOf(DayjsPlainDate)
      expect(numberResult).toBeInstanceOf(DayjsPlainDate)
    })
  })

  describe('format string YYYYMMDD', () => {
    it('returns WiseDate for valid YYYYMMDD date string', () => {
      const result = factory('20240101', 'YYYYMMDD')

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
    })

    it('returns WiseDate for another valid YYYYMMDD date string', () => {
      const result = factory('20251225', 'YYYYMMDD')

      expect(result).toBeInstanceOf(DayjsPlainDate)
      expect(result.format('YYYY-MM-DD')).toBe('2025-12-25')
    })

    it('throws for invalid YYYYMMDD date string', () => {
      expect(() => factory('20241301', 'YYYYMMDD')).toThrow()
    })
  })

  describe('edge cases', () => {
    it('handles empty string by throwing error', () => {
      expect(() => factory('')).toThrow()
    })

    it('handles whitespace string by throwing error', () => {
      expect(() => factory('   ')).toThrow()
    })
  })
})
