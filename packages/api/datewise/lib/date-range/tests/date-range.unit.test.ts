import { describe, it } from 'node:test'
import { expect } from 'expect'
import { InvalidDateRangeBounds } from '../date-range-errors.js'
import { DateRange } from '../date-range.js'
import { Inclusivity } from '../../common/inclusivity.js'
import { FutureInfinityDate } from '../../plain-date/future-infinity-date.js'
import { PastInfinityDate } from '../../plain-date/past-infinity-date.js'
import { plainDate } from '../../plain-date/index.js'

describe('DateRange unit tests', () => {
  describe('constructor', () => {
    it('Throws an error when a range is created for (+infinity, -infinity)', () => {
      expect(() => new DateRange(
        plainDate(Infinity),
        plainDate(-Infinity)
      )).toThrow(InvalidDateRangeBounds)
    })

    it('Creates a range for (+infinity, +infinity)', () => {
      expect(() => new DateRange(
        new FutureInfinityDate(),
        new FutureInfinityDate()
      )).not.toThrow()
    })

    it('Creates a range for (-infinity, -infinity)', () => {
      expect(() => new DateRange(
        new PastInfinityDate(),
        new PastInfinityDate()
      )).not.toThrow()
    })

    it('Creates a range for (-infinity, +infinity)', () => {
      expect(() => new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )).not.toThrow()
    })

    it('Throws an error when a range is created for (today, yesterday)', () => {
      expect(() =>
        new DateRange(plainDate.today(), plainDate.yesterday(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateRangeBounds)
    })

    it('Throws an error when a range is created for (today, today)', () => {
      expect(() =>
        new DateRange(plainDate.today(), plainDate.today(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateRangeBounds)
    })

    it('Throws an error when a range is created for (today, tomorrow)', () => {
      expect(() =>
        new DateRange(plainDate.today(), plainDate.tomorrow(), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateRangeBounds)
    })

    it('Throws an error when a range is created for [today, yesterday)', () => {
      expect(() =>
        new DateRange(
          plainDate.today(),
          plainDate.yesterday(),
          Inclusivity.INCLUSIVE,
          Inclusivity.EXCLUSIVE
        )
      ).toThrow(InvalidDateRangeBounds)
    })

    it('Throws an error when a range is created for [today, yesterday]', () => {
      expect(() =>
        new DateRange(
          plainDate.today(),
          plainDate.yesterday(),
          Inclusivity.INCLUSIVE,
          Inclusivity.INCLUSIVE
        )
      ).toThrow(InvalidDateRangeBounds)
    })

    it('Creates a range of 1 day [today, today]', () => {
      expect(() =>
        new DateRange(
          plainDate.today(),
          plainDate.today()
        )
      ).not.toThrow()
    })

    it('Creates a range of 1 day [today, tomorrow)', () => {
      const dateRange = new DateRange(
        plainDate.today(),
        plainDate.tomorrow(),
        Inclusivity.INCLUSIVE,
        Inclusivity.EXCLUSIVE
      )

      expect(dateRange.startDate.isSame(plainDate.today())).toBe(true)
      expect(dateRange.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('Creates a range of 2 days [today, tomorrow]', () => {
      const dateRange = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      expect(dateRange.startDate.isSame(plainDate.today())).toBe(true)
      expect(dateRange.endDate.isSame(plainDate.tomorrow())).toBe(true)
    })

    it('Creates a half open range (-infinity, today]', () => {
      expect(() =>
        new DateRange(
          new PastInfinityDate(),
          plainDate.today()
        )
      ).not.toThrow()
    })

    it('Creates a half open range [today, +infinity)', () => {
      expect(() =>
        new DateRange(
          plainDate.today(),
          new FutureInfinityDate()
        )
      ).not.toThrow()
    })

    it('Creates a date range from an inclusivity string', () => {
      expect(() =>
        new DateRange(
          plainDate(),
          plainDate(),
          '[]'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          plainDate(),
          plainDate.tomorrow(),
          '[)'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          plainDate.yesterday(),
          plainDate.tomorrow(),
          '()'
        )
      ).not.toThrow()

      expect(() =>
        new DateRange(
          plainDate.yesterday(),
          plainDate(),
          '(]'
        )
      ).not.toThrow()
    })
  })

  describe('years', () => {
    it('returns 0 years for [today,today]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.years).toBe(0)
    })

    it('returns 1 year for [today,today + 1 year]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(1, 'year')
      )

      expect(range.years).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )

      expect(range.years).toBe(Infinity)
    })
  })

  describe('months', () => {
    it('returns 0 months for [today,today]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.months).toBe(0)
    })

    it('returns 1 months for [1st of january, 1st of february]', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-02-01')
      )

      expect(range.months).toBe(1)
    })

    it('returns 0 months for [1st of january, 31st of january]', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-01-31')
      )

      expect(range.months).toBe(0)
    })

    it('returns 0 months for (1st of january, 31st of january]', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-01-31'),
        '(]'
      )

      expect(range.months).toBe(0)
    })

    it('returns 0 months for [1st of january, 31st of january)', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-01-31'),
        '[)'
      )

      expect(range.months).toBe(0)
    })

    it('returns 1 month for [today,today + 1 month]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(1, 'month')
      )

      expect(range.months).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )

      expect(range.months).toBe(Infinity)
    })
  })

  describe('quarters', () => {
    it('returns 0 quarters for [today,today]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.quarters).toBe(0)
    })

    it('returns 1 quarter for [today,today + 3 months]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(3, 'months')
      )

      expect(range.quarters).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )

      expect(range.quarters).toBe(Infinity)
    })
  })

  describe('weeks', () => {
    it('returns 0 weeks for [today,today]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.weeks).toBe(0)
    })

    it('returns 1 week for [today,today + 1 week]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(1, 'week')
      )

      expect(range.weeks).toBe(1)
    })

    it('returns 0 weeks for [today,today + 6 days]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(6, 'days')
      )

      expect(range.weeks).toBe(0)
    })

    it('returns 0 weeks for [today,today + 6 days)', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today().add(6, 'days')
      )

      expect(range.weeks).toBe(0)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )

      expect(range.weeks).toBe(Infinity)
    })
  })

  describe('days', () => {
    it('returns 0 days for (today,today)', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.days).toBe(0)
    })

    it('returns 0 days for [today,today]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      expect(range.days).toBe(0)
    })

    it('returns 1 day for [today, tomorrow]', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      expect(range.days).toBe(1)
    })

    it('returns 1 day for [today, tomorrow)', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      expect(range.days).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )

      expect(range.days).toBe(Infinity)
    })
  })

  describe('contains', () => {
    it('an infinite range contains everything (-infinity, +infinity)', () => {
      const range = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      expect(range.contains(new PastInfinityDate())).toBe(false)
      expect(range.contains(plainDate())).toBe(true)
      expect(range.contains(new FutureInfinityDate())).toBe(false)
    })

    it('[today, today] contains today', () => {
      const range = new DateRange(
        plainDate(),
        plainDate()
      )

      expect(range.contains(plainDate())).toBe(true)
    })

    it('[today, today] does not contain dates after today', () => {
      const range = new DateRange(
        plainDate(),
        plainDate()
      )

      expect(range.contains(plainDate.tomorrow())).toBe(false)
      expect(range.contains(new FutureInfinityDate())).toBe(false)
    })

    it('[today, today] does not contain dates before today', () => {
      const range = new DateRange(
        plainDate(),
        plainDate()
      )

      expect(range.contains(plainDate.yesterday())).toBe(false)
      expect(range.contains(new PastInfinityDate())).toBe(false)
    })

    it('(today, tomorrow] does not contain today', () => {
      const range = new DateRange(
        plainDate(),
        plainDate.tomorrow(),
        '(]'
      )

      expect(range.contains(plainDate())).toBe(false)
    })

    it('(today, tomorrow] contains tomorrow', () => {
      const range = new DateRange(
        plainDate(),
        plainDate.tomorrow(),
        '(]'
      )

      expect(range.contains(plainDate.tomorrow())).toBe(true)
    })

    it('[today, tomorrow) contains today', () => {
      const range = new DateRange(
        plainDate(),
        plainDate.tomorrow(),
        '[)'
      )

      expect(range.contains(plainDate())).toBe(true)
    })

    it('[today, tomorrow) does not contain tomorrow', () => {
      const range = new DateRange(
        plainDate(),
        plainDate.tomorrow(),
        '[)'
      )

      expect(range.contains(plainDate.tomorrow())).toBe(false)
    })
  })

  describe('overlaps', () => {
    it('two infinite ranges overlap', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('a date range overlaps with an infinite range', () => {
      const first = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })
  })

  describe('overlap', () => {
    it('overlap between (-infinity, +infinity) and (-infinity, +infinity) is (-infinity, +infinity)', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isPastInfinity()).toBe(true)
      expect(overlap.endDate.isFutureInfinity()).toBe(true)
    })

    it('overlap between (-infinity, today] and (-infinity, +infinity) is (-infinity, today]', () => {
      const first = new DateRange(
        new PastInfinityDate(),
        plainDate.today()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )

      const overlap = first.overlap(second)

      expect(overlap.startDate.isPastInfinity()).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, +infinity) and (-infinity, +infinity) is [today, +infinity)', () => {
      const first = new DateRange(
        plainDate.today(),
        new FutureInfinityDate()
      )
      const second = new DateRange(
        new PastInfinityDate(),
        new FutureInfinityDate()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isFutureInfinity()).toBe(true)
    })

    it('overlap between [today, today] and [today, today] is [today, today]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const second = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, today] and [yesterday, tomorrow] is [today,today]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, today] and (yesterday, tomorrow) is [today,today]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow(),
        '()'
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, today] and [yesterday, tomorrow) is [today,today]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow(),
        '[)'
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, today] and (yesterday, tomorrow] is [today,today]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.today()
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow(),
        '(]'
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between [today, tomorrow] and [yesterday, tomorrow] is [today,tomorrow]', () => {
      const first = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.tomorrow())).toBe(true)
    })

    it('overlap between [yesterday, tomorrow) and [yesterday, tomorrow] is [yesterday, today]', () => {
      const first = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow(),
        '[)'
      )

      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.yesterday())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })

    it('overlap between (yesterday, tomorrow) and [yesterday, tomorrow] is [today, today]', () => {
      const first = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow(),
        '()'
      )
      const second = new DateRange(
        plainDate.yesterday(),
        plainDate.tomorrow()
      )
      const overlap = first.overlap(second)

      expect(overlap.startDate.isSame(plainDate.today())).toBe(true)
      expect(overlap.endDate.isSame(plainDate.today())).toBe(true)
    })
  })

  describe('diff', () => {
    it('diff between (-infinity, +infinity) and (-infinity, +infinity) is none', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, today] and (-infinity, +infinity) is none', () => {
      const first = new DateRange(new PastInfinityDate(), plainDate.today())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between [today, today] and (-infinity, +infinity) is none', () => {
      const first = new DateRange(plainDate.today(), plainDate.today())
      const second = new DateRange(new PastInfinityDate(), new FutureInfinityDate())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, +infinity) and (-infinity, today] is [tomorrow, +infinity)', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(new PastInfinityDate(), plainDate.today())

      const expectedRange = new DateRange(plainDate.tomorrow(), new FutureInfinityDate())
      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [today, +infinity) is (-infinity, yesterday]', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(plainDate.today(), new FutureInfinityDate())

      const expectedRange = new DateRange(new PastInfinityDate(), plainDate.yesterday())
      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [today, today] is (-infinity, yesterday] and [tomorrow, +infinity)', () => {
      const first = new DateRange(new PastInfinityDate(), new FutureInfinityDate())
      const second = new DateRange(plainDate.today(), plainDate.today())

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)

      const firstRange = new DateRange(plainDate.pastInfinity(), plainDate.yesterday())

      expect(diff[0].isSame(firstRange)).toBe(true)

      const secondRange = new DateRange(plainDate.tomorrow(), plainDate.futureInfinity())

      expect(diff[1].isSame(secondRange)).toBe(true)
    })

    it('diff between [yesterday, tomorrow] and [today, today] is [yesterday, yesterday] and [tomorrow, tomorrow]', () => {
      const first = new DateRange(plainDate.yesterday(), plainDate.tomorrow())
      const second = new DateRange(plainDate.today(), plainDate.today())

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].isSame(new DateRange(plainDate.yesterday(), plainDate.yesterday()))).toBe(true)
      expect(diff[1].isSame(new DateRange(plainDate.tomorrow(), plainDate.tomorrow()))).toBe(true)
    })

    it('diff between [yesterday, today] and [tomorrow, +infinity) is [yesterday, today]', () => {
      const first = new DateRange(plainDate.yesterday(), plainDate.today())
      const second = new DateRange(plainDate.tomorrow(), new FutureInfinityDate())

      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(first)).toBe(true)
    })
  })

  describe('startsAfter', () => {
    it('returns true if start date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const yesterday = plainDate.yesterday()
      const isAfter = range.startsAfter(yesterday)

      expect(isAfter).toBe(true)
    })

    it('returns false if start date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const tomorrow = plainDate.tomorrow()
      const isAfter = range.startsAfter(tomorrow)

      expect(isAfter).toBe(false)
    })
  })

  describe('startsAfterOrOn', () => {
    it('returns true if start date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const yesterday = plainDate.yesterday()
      const isAfterOrOn = range.startsAfterOrOn(yesterday)

      expect(isAfterOrOn).toBe(true)
    })

    it('returns true if start date is on the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isAfterOrOn = range.startsAfterOrOn(today)

      expect(isAfterOrOn).toBe(true)
    })

    it('returns false if start date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const tomorrow = plainDate.tomorrow()
      const isAfterOrOn = range.startsAfterOrOn(tomorrow)

      expect(isAfterOrOn).toBe(false)
    })
  })

  describe('startsBefore', () => {
    it('returns true if start date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const tomorrow = plainDate.tomorrow()
      const isBefore = range.startsBefore(tomorrow)

      expect(isBefore).toBe(true)
    })

    it('returns false if start date is after the provided date', () => {
      const range = new DateRange(
        plainDate.tomorrow(),
        plainDate.tomorrow().add(1, 'day')
      )

      const today = plainDate.today()
      const isBefore = range.startsBefore(today)

      expect(isBefore).toBe(false)
    })
  })

  describe('startsBeforeOrOn', () => {
    it('returns true if start date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const tomorrow = plainDate.tomorrow()
      const isBeforeOrOn = range.startsBeforeOrOn(tomorrow)

      expect(isBeforeOrOn).toBe(true)
    })

    it('returns true if start date is on the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isBeforeOrOn = range.startsBeforeOrOn(today)

      expect(isBeforeOrOn).toBe(true)
    })

    it('returns false if start date is after the provided date', () => {
      const range = new DateRange(
        plainDate.tomorrow(),
        plainDate.tomorrow().add(1, 'day')
      )

      const today = plainDate.today()
      const isBeforeOrOn = range.startsBeforeOrOn(today)

      expect(isBeforeOrOn).toBe(false)
    })
  })

  describe('endsBefore', () => {
    it('returns true if end date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const tomorrow = plainDate.tomorrow()
      const isBefore = range.endsBefore(tomorrow)

      expect(isBefore).toBe(true)
    })

    it('returns false if end date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isBefore = range.endsBefore(today)

      expect(isBefore).toBe(false)
    })
  })

  describe('endsBeforeOrOn', () => {
    it('returns true if end date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const tomorrow = plainDate.tomorrow()
      const isBeforeOrOn = range.endsBeforeOrOn(tomorrow)

      expect(isBeforeOrOn).toBe(true)
    })

    it('returns true if end date is on the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const today = plainDate.today()
      const isBeforeOrOn = range.endsBeforeOrOn(today)

      expect(isBeforeOrOn).toBe(true)
    })

    it('returns false if end date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isBeforeOrOn = range.endsBeforeOrOn(today)

      expect(isBeforeOrOn).toBe(false)
    })
  })

  describe('endsAfter', () => {
    it('returns true if end date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isAfter = range.endsAfter(today)

      expect(isAfter).toBe(true)
    })

    it('returns false if end date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const tomorrow = plainDate.tomorrow()
      const isAfter = range.endsAfter(tomorrow)

      expect(isAfter).toBe(false)
    })
  })

  describe('endsAfterOrOn', () => {
    it('returns true if end date is after the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.tomorrow()
      )

      const today = plainDate.today()
      const isAfterOrOn = range.endsAfterOrOn(today)

      expect(isAfterOrOn).toBe(true)
    })

    it('returns true if end date is on the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const today = plainDate.today()
      const isAfterOrOn = range.endsAfterOrOn(today)

      expect(isAfterOrOn).toBe(true)
    })

    it('returns false if end date is before the provided date', () => {
      const range = new DateRange(
        plainDate.today(),
        plainDate.today()
      )

      const tomorrow = plainDate.tomorrow()
      const isAfterOrOn = range.endsAfterOrOn(tomorrow)

      expect(isAfterOrOn).toBe(false)
    })
  })
})
