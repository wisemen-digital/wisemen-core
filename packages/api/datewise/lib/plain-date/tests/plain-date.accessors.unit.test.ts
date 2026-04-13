import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '../../common/init-dayjs.js'
import { factory } from '../plain-date.factory.js'
import { DayjsPlainDate } from '../dayjs-plain-date.js'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { PastInfinityDate } from '../past-infinity-date.js'
import { plainDate } from '../plain-date.fn.js'

describe('PlainDate accessors', () => {
  before(() => initDayjs())

  describe('day', () => {
    it('returns the day of the week', () => {
      const day = factory('2025-10-12') // sunday

      for (let i = 0; i < 7; i++) {
        expect(day.day() === i)
        day.add(1, 'day')
      }

      expect(day.day()).toBe(0) // wrapped around to sunday
    })

    it('throws when accessing the day of the week of an infinite date', () => {
      expect(() => factory('infinity').day()).toThrow()
      expect(() => factory('-infinity').day()).toThrow()
    })
  })

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const duration = date.until(date)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to an identical date', () => {
      const date1 = new DayjsPlainDate('2024-01-15')
      const date2 = new DayjsPlainDate('2024-01-15')
      const duration = date1.until(date2)

      expect(duration.days).toBe(0)
    })

    it('returns positive duration for future dates', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2024-01-10')
      const duration = date1.until(date2)

      expect(duration.days).toBe(9)
    })

    it('returns negative duration for past dates', () => {
      const date1 = new DayjsPlainDate('2024-01-10')
      const date2 = new DayjsPlainDate('2024-01-01')
      const duration = date1.until(date2)

      expect(duration.days).toBe(-9)
    })

    it('returns infinity when compared to FutureInfinityDate', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const futureInfinity = new FutureInfinityDate()
      const duration = date.until(futureInfinity)

      expect(duration.days).toBe(Infinity)
    })

    it('returns negative infinity when compared to PastInfinityDate', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const pastInfinity = new PastInfinityDate()
      const duration = date.until(pastInfinity)

      expect(duration.days).toBe(-Infinity)
    })

    it('correctly calculates duration for large date ranges', () => {
      const date1 = new DayjsPlainDate('2020-01-01')
      const date2 = new DayjsPlainDate('2024-01-01')
      const duration = date1.until(date2)

      // Should be 1461 days (4 years + 1 leap day)
      expect(duration.days).toBe(1461)
    })

    it('correctly calculates duration across month boundaries', () => {
      const date1 = new DayjsPlainDate('2024-01-31')
      const date2 = new DayjsPlainDate('2024-02-01')
      const duration = date1.until(date2)

      expect(duration.days).toBe(1)
    })

    it('correctly calculates duration across year boundaries', () => {
      const date1 = new DayjsPlainDate('2023-12-31')
      const date2 = new DayjsPlainDate('2024-01-01')
      const duration = date1.until(date2)

      expect(duration.days).toBe(1)
    })

    it('handles leap years correctly', () => {
      const date1 = new DayjsPlainDate('2024-02-28')
      const date2 = new DayjsPlainDate('2024-03-01')
      const duration = date1.until(date2)

      // 2024 is a leap year, so Feb 29 exists
      expect(duration.days).toBe(2)
    })

    it('returns correct duration when compared with a Date object', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new Date('2024-01-05')
      const duration = date1.until(date2)

      expect(duration.days).toBe(4)
    })

    it('returns correct duration when compared with a string', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const duration = date1.until('2024-01-08')

      expect(duration.days).toBe(7)
    })

    it('returns correct duration for today', () => {
      const today = plainDate.today()
      const duration = today.until(today)

      expect(duration.days).toBe(0)
    })

    it('returns positive duration for tomorrow', () => {
      const today = plainDate.today()
      const tomorrow = plainDate.tomorrow()
      const duration = today.until(tomorrow)

      expect(duration.days).toBe(1)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const duration = date.since(date)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to an identical date', () => {
      const date1 = new DayjsPlainDate('2024-01-15')
      const date2 = new DayjsPlainDate('2024-01-15')
      const duration = date1.since(date2)

      expect(duration.days).toBe(0)
    })

    it('returns negative duration for future dates', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2024-01-10')
      const duration = date1.since(date2)

      expect(duration.days).toBe(-9)
    })

    it('returns positive duration for past dates', () => {
      const date1 = new DayjsPlainDate('2024-01-10')
      const date2 = new DayjsPlainDate('2024-01-01')
      const duration = date1.since(date2)

      expect(duration.days).toBe(9)
    })

    it('returns negative infinity when compared to FutureInfinityDate', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const futureInfinity = new FutureInfinityDate()
      const duration = date.since(futureInfinity)

      expect(duration.days).toBe(-Infinity)
    })

    it('returns infinity when compared to PastInfinityDate', () => {
      const date = new DayjsPlainDate('2024-01-15')
      const pastInfinity = new PastInfinityDate()
      const duration = date.since(pastInfinity)

      expect(duration.days).toBe(Infinity)
    })

    it('correctly calculates duration for large date ranges', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2020-01-01')
      const duration = date1.since(date2)

      // Should be 1461 days (4 years + 1 leap day)
      expect(duration.days).toBe(1461)
    })

    it('correctly calculates duration across month boundaries', () => {
      const date1 = new DayjsPlainDate('2024-02-01')
      const date2 = new DayjsPlainDate('2024-01-31')
      const duration = date1.since(date2)

      expect(duration.days).toBe(1)
    })

    it('correctly calculates duration across year boundaries', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2023-12-31')
      const duration = date1.since(date2)

      expect(duration.days).toBe(1)
    })

    it('handles leap years correctly', () => {
      const date1 = new DayjsPlainDate('2024-03-01')
      const date2 = new DayjsPlainDate('2024-02-28')
      const duration = date1.since(date2)

      // 2024 is a leap year, so Feb 29 exists
      expect(duration.days).toBe(2)
    })

    it('returns correct duration when compared with a Date object', () => {
      const date1 = new DayjsPlainDate('2024-01-05')
      const date2 = new Date('2024-01-01')
      const duration = date1.since(date2)

      expect(duration.days).toBe(4)
    })

    it('returns correct duration when compared with a string', () => {
      const date1 = new DayjsPlainDate('2024-01-08')
      const duration = date1.since('2024-01-01')

      expect(duration.days).toBe(7)
    })

    it('returns correct duration for today', () => {
      const today = plainDate.today()
      const duration = today.since(today)

      expect(duration.days).toBe(0)
    })

    it('returns negative duration for tomorrow', () => {
      const today = plainDate.today()
      const tomorrow = plainDate.tomorrow()
      const duration = today.since(tomorrow)

      expect(duration.days).toBe(-1)
    })
  })

  describe('until and since are opposites', () => {
    it('until and since return opposite signs for different dates', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2024-01-10')

      const until = date1.until(date2)
      const since = date1.since(date2)

      expect(until.days).toBe(-since.days)
    })

    it('until and since are both zero for identical dates', () => {
      const date1 = new DayjsPlainDate('2024-01-01')
      const date2 = new DayjsPlainDate('2024-01-01')

      expect(date1.until(date2).days).toBe(0)
      expect(date1.since(date2).days).toBe(0)
    })
  })
})
