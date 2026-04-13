import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '#src/init-dayjs.js'
import { wiseDate } from '#src/wise-date.factory.js'
import { WiseDate } from '#src/wise-date.js'
import { FutureInfinityDate } from '#src/future-infinity-date.js'
import { PastInfinityDate } from '#src/past-infinity-date.js'

describe('WiseDate', () => {
  before(() => initDayjs())

  describe('factory', () => {
    describe('no argument', () => {
      it('returns a WiseDate representing today', () => {
        const result = wiseDate()

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.isSame(WiseDate.today())).toBe(true)
      })
    })

    describe('undefined argument', () => {
      it('returns a WiseDate representing today', () => {
        const result = wiseDate(undefined)

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.isSame(WiseDate.today())).toBe(true)
      })
    })

    describe('null argument', () => {
      it('returns null', () => {
        const result = wiseDate(null)

        expect(result).toBe(null)
      })
    })

    describe('infinity string arguments', () => {
      it('returns FutureInfinityDate for "infinity"', () => {
        const result = wiseDate('infinity')

        expect(result).toBeInstanceOf(FutureInfinityDate)
        expect(result.isFutureInfinity()).toBe(true)
        expect(result.toString()).toBe('infinity')
      })

      it('returns PastInfinityDate for "-infinity"', () => {
        const result = wiseDate('-infinity')

        expect(result).toBeInstanceOf(PastInfinityDate)
        expect(result.isPastInfinity()).toBe(true)
        expect(result.toString()).toBe('-infinity')
      })

      it('returns FutureInfinityDate for "+infinity"', () => {
        const result = wiseDate('+infinity')

        expect(result).toBeInstanceOf(FutureInfinityDate)
        expect(result.isFutureInfinity()).toBe(true)
        expect(result.toString()).toBe('infinity')
      })
    })

    describe('infinity number arguments', () => {
      it('returns FutureInfinityDate for Infinity', () => {
        const result = wiseDate(Infinity)

        expect(result).toBeInstanceOf(FutureInfinityDate)
        expect(result.isFutureInfinity()).toBe(true)
      })

      it('returns PastInfinityDate for -Infinity', () => {
        const result = wiseDate(-Infinity)

        expect(result).toBeInstanceOf(PastInfinityDate)
        expect(result.isPastInfinity()).toBe(true)
      })
    })

    describe('string date arguments', () => {
      it('returns WiseDate for valid date string', () => {
        const result = wiseDate('2024-01-01')

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
      })

      it('returns WiseDate for another valid date string', () => {
        const result = wiseDate('2025-12-25')

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.format('YYYY-MM-DD')).toBe('2025-12-25')
      })

      it('throws for invalid date string', () => {
        expect(() => wiseDate('not-a-date')).toThrow()
      })

      it('throws for malformed date string', () => {
        expect(() => wiseDate('2024-13-01')).toThrow()
      })
    })

    describe('number date arguments', () => {
      it('returns WiseDate for valid timestamp', () => {
        const timestamp = new Date('2024-01-01').getTime()
        const result = wiseDate(timestamp)

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
      })

      it('returns WiseDate for zero timestamp (epoch)', () => {
        const result = wiseDate(0)

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.format('YYYY-MM-DD')).toBe('1970-01-01')
      })

      it('returns WiseDate for positive timestamp', () => {
        const timestamp = 1640995200000 // 2022-01-01 00:00:00 UTC
        const result = wiseDate(timestamp)

        expect(result).toBeInstanceOf(WiseDate)
      })

      it('returns WiseDate for negative timestamp', () => {
        const timestamp = -86400000 // 1969-12-31
        const result = wiseDate(timestamp)

        expect(result).toBeInstanceOf(WiseDate)
      })
    })

    describe('Date object arguments', () => {
      it('returns WiseDate for Date object', () => {
        const date = new Date('2024-01-01')
        const result = wiseDate(date)

        expect(result).toBeInstanceOf(WiseDate)
        expect(result.format('YYYY-MM-DD')).toBe('2024-01-01')
      })
    })

    describe('type safety', () => {
      it('maintains correct return types for overloads', () => {
        // These tests verify the TypeScript overloads work correctly
        const nullResult: null = wiseDate(null)
        const undefinedResult: WiseDate = wiseDate(undefined)
        const noArgResult: WiseDate = wiseDate()
        const stringResult: WiseDate = wiseDate('2024-01-01')
        const numberResult: WiseDate = wiseDate(123456789)

        expect(nullResult).toBe(null)
        expect(undefinedResult).toBeInstanceOf(WiseDate)
        expect(noArgResult).toBeInstanceOf(WiseDate)
        expect(stringResult).toBeInstanceOf(WiseDate)
        expect(numberResult).toBeInstanceOf(WiseDate)
      })
    })

    describe('edge cases', () => {
      it('handles empty string by throwing error', () => {
        expect(() => wiseDate('')).toThrow()
      })

      it('handles whitespace string by throwing error', () => {
        expect(() => wiseDate('   ')).toThrow()
      })
    })
  })
})
