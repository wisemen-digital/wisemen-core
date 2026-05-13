import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { PastInfinityDate } from '../past-infinity-date.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../index.js'

describe('PlainDate ordering', () => {
  before(() => initDayjs())

  describe('relative order of dates', () => {
    describe('today relative to others', () => {
      it('respects ordering of today relative to tomorrow', () => {
        expect(plainDate.today().isBefore(plainDate.tomorrow())).toBe(true)
        expect(plainDate.today().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.today().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of today relative to today', () => {
        expect(plainDate.today().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.today().isAfter(plainDate.today())).toBe(false)
        expect(plainDate.today().isSame(plainDate.today())).toBe(true)
      })

      it('respects ordering of today relative to yesterday', () => {
        expect(plainDate.today().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.today().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.today().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of today relative to future infinity', () => {
        expect(plainDate.today().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.today().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.today().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of today relative to past infinity', () => {
        expect(plainDate.today().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.today().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.today().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('yesterday relative to others', () => {
      it('respects ordering of yesterday relative to tomorrow', () => {
        expect(plainDate.yesterday().isBefore(plainDate.tomorrow())).toBe(true)
        expect(plainDate.yesterday().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of yesterday relative to today', () => {
        expect(plainDate.yesterday().isBefore(plainDate.today())).toBe(true)
        expect(plainDate.yesterday().isAfter(plainDate.today())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of yesterday relative to yesterday', () => {
        expect(plainDate.yesterday().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.yesterday().isAfter(plainDate.yesterday())).toBe(false)
        expect(plainDate.yesterday().isSame(plainDate.yesterday())).toBe(true)
      })

      it('respects ordering of yesterday relative to future infinity', () => {
        expect(plainDate.yesterday().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.yesterday().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.yesterday().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of yesterday relative to past infinity', () => {
        expect(plainDate.yesterday().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.yesterday().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.yesterday().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isSame(plainDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.today())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(plainDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(plainDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('tomorrow relative to others', () => {
      it('respects ordering of tomorrow relative to tomorrow', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.tomorrow())).toBe(false)
        expect(plainDate.tomorrow().isSame(plainDate.tomorrow())).toBe(true)
      })

      it('respects ordering of tomorrow relative to today', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.today())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.today())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of tomorrow relative to yesterday', () => {
        expect(plainDate.tomorrow().isBefore(plainDate.yesterday())).toBe(false)
        expect(plainDate.tomorrow().isAfter(plainDate.yesterday())).toBe(true)
        expect(plainDate.tomorrow().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of tomorrow relative to future infinity', () => {
        expect(plainDate.tomorrow().isBefore(new FutureInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isAfter(new FutureInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of tomorrow relative to past infinity', () => {
        expect(plainDate.tomorrow().isBefore(new PastInfinityDate())).toBe(false)
        expect(plainDate.tomorrow().isAfter(new PastInfinityDate())).toBe(true)
        expect(plainDate.tomorrow().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('future infinity relative to others', () => {
      it('respects ordering of future infinity relative to tomorrow', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.tomorrow())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.tomorrow())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of future infinity relative to today', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.today())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.today())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of future infinity relative to yesterday', () => {
        expect(new FutureInfinityDate().isBefore(plainDate.yesterday())).toBe(false)
        expect(new FutureInfinityDate().isAfter(plainDate.yesterday())).toBe(true)
        expect(new FutureInfinityDate().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of future infinity relative to future infinity', () => {
        expect(new FutureInfinityDate().isBefore(new FutureInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new FutureInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new FutureInfinityDate())).toBe(true)
      })

      it('respects ordering of future infinity relative to past infinity', () => {
        expect(new FutureInfinityDate().isBefore(new PastInfinityDate())).toBe(false)
        expect(new FutureInfinityDate().isAfter(new PastInfinityDate())).toBe(true)
        expect(new FutureInfinityDate().isSame(new PastInfinityDate())).toBe(false)
      })
    })

    describe('past infinity relative to others', () => {
      it('respects ordering of past infinity relative to tomorrow', () => {
        expect(new PastInfinityDate().isBefore(plainDate.tomorrow())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.tomorrow())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.tomorrow())).toBe(false)
      })

      it('respects ordering of past infinity relative to today', () => {
        expect(new PastInfinityDate().isBefore(plainDate.today())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.today())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.today())).toBe(false)
      })

      it('respects ordering of past infinity relative to yesterday', () => {
        expect(new PastInfinityDate().isBefore(plainDate.yesterday())).toBe(true)
        expect(new PastInfinityDate().isAfter(plainDate.yesterday())).toBe(false)
        expect(new PastInfinityDate().isSame(plainDate.yesterday())).toBe(false)
      })

      it('respects ordering of past infinity relative to future infinity', () => {
        expect(new PastInfinityDate().isBefore(new FutureInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new FutureInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new FutureInfinityDate())).toBe(false)
      })

      it('respects ordering of past infinity relative to past infinity', () => {
        expect(new PastInfinityDate().isBefore(new PastInfinityDate())).toBe(true)
        expect(new PastInfinityDate().isAfter(new PastInfinityDate())).toBe(false)
        expect(new PastInfinityDate().isSame(new PastInfinityDate())).toBe(true)
      })
    })
  })

  describe('compare method', () => {
    it('returns 0 when comparing a date to itself', () => {
      const date = plainDate('2025-06-15')
      const result = date.compare(date)

      expect(result).toBe(0)
    })

    it('returns 0 when comparing identical dates', () => {
      const date1 = plainDate('2025-06-15')
      const date2 = plainDate('2025-06-15')
      const result = date1.compare(date2)

      expect(result).toBe(0)
    })

    it('returns negative value when this date is before the other', () => {
      const earlier = plainDate('2025-06-15')
      const later = plainDate('2025-06-20')
      const result = earlier.compare(later)

      expect(result).toBeLessThan(0)
      expect(result).toBe(-5)
    })

    it('returns positive value when this date is after the other', () => {
      const later = plainDate('2025-06-20')
      const earlier = plainDate('2025-06-15')
      const result = later.compare(earlier)

      expect(result).toBeGreaterThan(0)
      expect(result).toBe(5)
    })

    it('returns negative infinity when compared to future infinity', () => {
      const date = plainDate('2025-06-15')
      const result = date.compare(new FutureInfinityDate())

      expect(result).toBe(-Infinity)
    })

    it('returns positive infinity when compared to past infinity', () => {
      const date = plainDate('2025-06-15')
      const result = date.compare(new PastInfinityDate())

      expect(result).toBe(Infinity)
    })

    it('future infinity returns 0 when compared to itself', () => {
      const futureInfinity = new FutureInfinityDate()
      const result = futureInfinity.compare(futureInfinity)

      expect(result).toBe(0)
    })

    it('future infinity returns positive infinity when compared to regular date', () => {
      const futureInfinity = new FutureInfinityDate()
      const date = plainDate('2025-06-15')
      const result = futureInfinity.compare(date)

      expect(result).toBe(Infinity)
    })

    it('past infinity returns 0 when compared to itself', () => {
      const pastInfinity = new PastInfinityDate()
      const result = pastInfinity.compare(pastInfinity)

      expect(result).toBe(0)
    })

    it('past infinity returns negative infinity when compared to regular date', () => {
      const pastInfinity = new PastInfinityDate()
      const date = plainDate('2025-06-15')
      const result = pastInfinity.compare(date)

      expect(result).toBe(-Infinity)
    })

    it('can be used to sort dates in ascending order', () => {
      const dates = [
        plainDate('2025-03-15'),
        plainDate('2025-01-10'),
        plainDate('2025-02-20')
      ]

      dates.sort((a, b) => a.compare(b))

      expect(dates[0].toString()).toBe('2025-01-10')
      expect(dates[1].toString()).toBe('2025-02-20')
      expect(dates[2].toString()).toBe('2025-03-15')
    })

    it('can be used to sort dates in descending order', () => {
      const dates = [
        plainDate('2025-01-10'),
        plainDate('2025-03-15'),
        plainDate('2025-02-20')
      ]

      dates.sort((a, b) => b.compare(a))

      expect(dates[0].toString()).toBe('2025-03-15')
      expect(dates[1].toString()).toBe('2025-02-20')
      expect(dates[2].toString()).toBe('2025-01-10')
    })

    it('can sort dates with past infinity at the start', () => {
      const dates = [
        plainDate('2025-03-15'),
        new PastInfinityDate(),
        plainDate('2025-01-10')
      ]

      dates.sort((a, b) => a.compare(b))

      expect(dates[0].isPastInfinity()).toBe(true)
      expect(dates[1].toString()).toBe('2025-01-10')
      expect(dates[2].toString()).toBe('2025-03-15')
    })

    it('can sort dates with future infinity at the end', () => {
      const dates = [
        plainDate('2025-01-10'),
        new FutureInfinityDate(),
        plainDate('2025-03-15')
      ]

      dates.sort((a, b) => a.compare(b))

      expect(dates[0].toString()).toBe('2025-01-10')
      expect(dates[1].toString()).toBe('2025-03-15')
      expect(dates[2].isFutureInfinity()).toBe(true)
    })

    it('can sort dates with both infinities', () => {
      const dates = [
        plainDate('2025-02-20'),
        new FutureInfinityDate(),
        new PastInfinityDate(),
        plainDate('2025-01-10')
      ]

      dates.sort((a, b) => a.compare(b))

      expect(dates[0].isPastInfinity()).toBe(true)
      expect(dates[1].toString()).toBe('2025-01-10')
      expect(dates[2].toString()).toBe('2025-02-20')
      expect(dates[3].isFutureInfinity()).toBe(true)
    })

    it('returns consistent results with isBefore', () => {
      const date1 = plainDate('2025-01-10')
      const date2 = plainDate('2025-03-15')

      expect(date1.compare(date2) < 0).toBe(date1.isBefore(date2))
      expect(date2.compare(date1) < 0).toBe(date2.isBefore(date1))
    })

    it('returns consistent results with isAfter', () => {
      const date1 = plainDate('2025-01-10')
      const date2 = plainDate('2025-03-15')

      expect(date1.compare(date2) > 0).toBe(date1.isAfter(date2))
      expect(date2.compare(date1) > 0).toBe(date2.isAfter(date1))
    })

    it('handles complex sorting scenario with multiple dates and infinities', () => {
      const dates = [
        plainDate('2025-06-01'),
        new FutureInfinityDate(),
        plainDate('2025-01-15'),
        new PastInfinityDate(),
        plainDate('2025-12-31'),
        plainDate('2025-03-20')
      ]

      dates.sort((a, b) => a.compare(b))

      expect(dates[0].isPastInfinity()).toBe(true)
      expect(dates[1].toString()).toBe('2025-01-15')
      expect(dates[2].toString()).toBe('2025-03-20')
      expect(dates[3].toString()).toBe('2025-06-01')
      expect(dates[4].toString()).toBe('2025-12-31')
      expect(dates[5].isFutureInfinity()).toBe(true)
    })
  })
})
