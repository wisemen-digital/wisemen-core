import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Inclusivity } from '#src/inclusivity.js'
import { PastInfinity } from '#src/past-infinity.js'
import { timestamp } from '#src/timestamp.factory.js'
import { DateTimeRange } from '#src/date-time-range.js'
import { FutureInfinity } from '#src/future-infinity.js'
import { InvalidDateTimeRangeBounds } from '#src/date-time-range.errors.js'

describe('DateTimeRange unit tests', () => {
  describe('constructor', () => {
    it('Throws an error when a range is created for (+infinity, -infinity)', () => {
      expect(() => new DateTimeRange(
        new FutureInfinity(),
        new PastInfinity()
      )).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Throws for (+infinity, +infinity)', () => {
      expect(() => new DateTimeRange(
        new FutureInfinity(),
        new FutureInfinity()
      )).toThrow()
    })

    it('Throws for (-infinity, -infinity)', () => {
      expect(() => new DateTimeRange(
        new PastInfinity(),
        new PastInfinity()
      )).toThrow()
    })

    it('Creates a range for (-infinity, +infinity)', () => {
      expect(() => new DateTimeRange(
        new PastInfinity(),
        new FutureInfinity()
      )).not.toThrow()
    })

    it('Throws an error when a range is created for (today, yesterday)', () => {
      expect(() =>
        new DateTimeRange(timestamp(), timestamp().subtract(1, 'day'), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Throws an error when a range is created for (now, now)', () => {
      const now = timestamp()

      expect(() =>
        new DateTimeRange(now, now, Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Throws an error when a range is created for (now, now + 1ms)', () => {
      const now = timestamp()

      expect(() =>
        new DateTimeRange(now, now.add(1, 'ms'), Inclusivity.EXCLUSIVE)
      ).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Throws an error when a range is created for [today, yesterday)', () => {
      expect(() =>
        new DateTimeRange(
          timestamp(),
          timestamp().subtract(1, 'day'),
          Inclusivity.INCLUSIVE,
          Inclusivity.EXCLUSIVE
        )
      ).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Throws an error when a range is created for [today, yesterday]', () => {
      expect(() =>
        new DateTimeRange(
          timestamp(),
          timestamp().subtract(1, 'day'),
          Inclusivity.INCLUSIVE,
          Inclusivity.INCLUSIVE
        )
      ).toThrow(InvalidDateTimeRangeBounds)
    })

    it('Creates a range containing one timestamp [now, now]', () => {
      const now = timestamp()

      expect(() => new DateTimeRange(now, now)).not.toThrow()
    })

    it('Creates a range of 1 ms [now, now +1ms)', () => {
      const now = timestamp()
      const dateRange = new DateTimeRange(
        now,
        now.add(1, 'ms'),
        Inclusivity.INCLUSIVE,
        Inclusivity.EXCLUSIVE
      )

      expect(dateRange.from.isSame(now)).toBe(true)
      expect(dateRange.until.isSame(now)).toBe(true)
    })

    it('Creates a range of 2 ms [now, now + 1ms]', () => {
      const now = timestamp()

      const dateRange = new DateTimeRange(now, now.add(1, 'ms'))

      expect(dateRange.from.isSame(now)).toBe(true)
      expect(dateRange.until.isSame(now.add(1, 'ms'))).toBe(true)
    })

    it('Creates a half open range (-infinity, today]', () => {
      expect(() =>
        new DateTimeRange(new PastInfinity(), timestamp())
      ).not.toThrow()
    })

    it('Creates a half open range [today, +infinity)', () => {
      expect(() =>
        new DateTimeRange(timestamp(), new FutureInfinity())
      ).not.toThrow()
    })

    it('Creates a date range from an inclusivity string', () => {
      expect(() =>
        new DateTimeRange(timestamp(), timestamp(), '[]')
      ).not.toThrow()

      expect(() =>
        new DateTimeRange(timestamp(), timestamp().add(1, 'ms'), '[)')
      ).not.toThrow()

      expect(() =>
        new DateTimeRange(timestamp().subtract(1, 'year'), timestamp().add(1, 'week'), '()')
      ).not.toThrow()

      expect(() =>
        new DateTimeRange(timestamp().subtract(1, 'hour'), timestamp().add(1, 'minute'), '(]')
      ).not.toThrow()
    })
  })

  describe('years', () => {
    it('returns 0 years for [today,today]', () => {
      const range = new DateTimeRange(timestamp(), timestamp())

      expect(range.years).toBe(0)
    })

    it('returns 1 year for [today,today + 1 year]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(1, 'year')
      )

      expect(range.years).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.years).toBe(Infinity)
    })
  })

  describe('months', () => {
    it('returns 0 months for [today,today]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.months).toBe(0)
    })

    it('returns 1 months for [1st of january, 1st of february]', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01'),
        timestamp('2024-02-01')
      )

      expect(range.months).toBe(1)
    })

    it('returns 0 months for [1st of january, 31st of january]', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01'),
        timestamp('2024-01-31')
      )

      expect(range.months).toBe(0)
    })

    it('returns 0 months for (1st of january, 31st of january]', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01'),
        timestamp('2024-01-31'),
        '(]'
      )

      expect(range.months).toBe(0)
    })

    it('returns 0 months for [1st of january, 31st of january)', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01'),
        timestamp('2024-01-31'),
        '[)'
      )

      expect(range.months).toBe(0)
    })

    it('returns 1 month for [today,today + 1 month]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(1, 'month')
      )

      expect(range.months).toBe(1)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.months).toBe(Infinity)
    })
  })

  describe('weeks', () => {
    it('returns 0 weeks for [today,today]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.weeks).toBe(0)
    })

    it('returns 1 week for [today,today + 1 week]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(1, 'week')
      )

      expect(range.weeks).toBe(1)
    })

    it('returns 0 weeks for [today,today + 6 days]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(6, 'days')
      )

      expect(range.weeks).toBe(0)
    })

    it('returns 0 weeks for [today,today + 6 days)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(6, 'days')
      )

      expect(range.weeks).toBe(0)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.weeks).toBe(Infinity)
    })
  })

  describe('days', () => {
    it('returns 0 days for (today,today)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.days).toBe(0)
    })

    it('returns 0 days for [today,today]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.days).toBe(0)
    })

    it('returns 1 day for [today, tomorrow]', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp().add(1, 'day')
      )

      expect(range.days).toBe(1)
    })

    it('returns 0 day for [today, tomorrow)', () => {
      const now = timestamp()
      const range = new DateTimeRange(
        now,
        now.add(1, 'day'),
        Inclusivity.INCLUSIVE,
        Inclusivity.EXCLUSIVE
      )

      expect(range.days).toBe(0)
    })

    it('returns infinity for [today, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.days).toBe(Infinity)
    })
  })

  describe('hours', () => {
    it('returns 0 hours for (now,now)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.hours).toBe(0)
    })

    it('returns 0 hours for [now,now + 1 hour - 1ms]', () => {
      const now = timestamp()
      const range = new DateTimeRange(
        now,
        now.add(1, 'hour').subtract(1, 'ms')
      )

      expect(range.hours).toBe(0)
    })

    it('returns 1 hour for [now, now + 1 hour]', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'hour'))

      expect(range.hours).toBe(1)
    })

    it('returns 0 hour for [now, now + 1hour)', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'hour'), '[)')

      expect(range.hours).toBe(0)
    })

    it('returns infinity for [now, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.hours).toBe(Infinity)
    })
  })

  describe('contains', () => {
    it('an infinite range contains everything (-infinity, +infinity)', () => {
      const range = new DateTimeRange(
        new PastInfinity(),
        new FutureInfinity()
      )

      expect(range.contains(new PastInfinity())).toBe(true)
      expect(range.contains(timestamp())).toBe(true)
      expect(range.contains(new FutureInfinity())).toBe(true)
    })

    it('[now, now] contains today', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now)

      expect(range.contains(now)).toBe(true)
    })

    it('[now, now] does not contain now + 1ms nor +infinity', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now)

      expect(range.contains(now.add(1, 'ms'))).toBe(false)
      expect(range.contains(new FutureInfinity())).toBe(false)
    })

    it('[today, today] does not contain now - 1ms nor -infinity', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now)

      expect(range.contains(now.subtract(1, 'ms'))).toBe(false)
      expect(range.contains(new PastInfinity())).toBe(false)
    })

    it('(now, now +1ms] does not contain now', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'), '(]')

      expect(range.contains(now)).toBe(false)
    })

    it('(now, now + 1ms] contains now + 1ms', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'), '(]')

      expect(range.contains(now.add(1, 'ms'))).toBe(true)
    })

    it('[now, now + 1ms) contains today', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'), '[)')

      expect(range.contains(now)).toBe(true)
    })

    it('[now, now +1ms) does not contain now + 1ms', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'), '[)')

      expect(range.contains(now.add(1, 'ms'))).toBe(false)
    })
  })

  describe('minutes', () => {
    it('returns 0 minutes for (now,now)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.minutes).toBe(0)
    })

    it('returns 0 minutes for [now,now + 1 minute - 1ms]', () => {
      const now = timestamp()
      const range = new DateTimeRange(
        now,
        now.add(1, 'minute').subtract(1, 'ms')
      )

      expect(range.minutes).toBe(0)
    })

    it('returns 1 minute for [now, now + 1 minute]', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'minute'))

      expect(range.minutes).toBe(1)
    })

    it('returns 0 minute for [now, now + 1minute)', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'minute'), '[)')

      expect(range.minutes).toBe(0)
    })

    it('returns infinity for [now, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.minutes).toBe(Infinity)
    })
  })

  describe('seconds', () => {
    it('returns 0 seconds for (now,now)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.seconds).toBe(0)
    })

    it('returns 0 seconds for [now,now + 1 second - 1ms]', () => {
      const now = timestamp()
      const range = new DateTimeRange(
        now,
        now.add(1, 'second').subtract(1, 'ms')
      )

      expect(range.seconds).toBe(0)
    })

    it('returns 1 second for [now, now + 1 second]', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'second'))

      expect(range.seconds).toBe(1)
    })

    it('returns 0 second for [now, now + 1second)', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'second'), '[)')

      expect(range.seconds).toBe(0)
    })

    it('returns infinity for [now, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.seconds).toBe(Infinity)
    })
  })

  describe('milliseconds', () => {
    it('returns 0 milliseconds for (now,now)', () => {
      const range = new DateTimeRange(
        timestamp(),
        timestamp()
      )

      expect(range.milliseconds).toBe(0)
    })

    it('returns 0 milliseconds for [now,now]', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now)

      expect(range.milliseconds).toBe(0)
    })

    it('returns 1 millisecond for [now, now + 1 millisecond]', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'millisecond'))

      expect(range.milliseconds).toBe(1)
    })

    it('returns 0 millisecond for [now, now + 1millisecond)', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'millisecond'), '[)')

      expect(range.milliseconds).toBe(0)
    })

    it('returns infinity for [now, +Infinity)', () => {
      const range = new DateTimeRange(
        timestamp(),
        new FutureInfinity()
      )

      expect(range.milliseconds).toBe(Infinity)
    })
  })

  describe('overlaps', () => {
    it('two infinite ranges overlap', () => {
      const first = new DateTimeRange(
        new PastInfinity(),
        new FutureInfinity()
      )
      const second = new DateTimeRange(
        new PastInfinity(),
        new FutureInfinity()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('a date range overlaps with an infinite range', () => {
      const first = new DateTimeRange(
        timestamp(),
        timestamp().add(1, 'day')
      )
      const second = new DateTimeRange(
        new PastInfinity(),
        new FutureInfinity()
      )

      expect(first.overlaps(second)).toBe(true)
      expect(second.overlaps(first)).toBe(true)
    })

    it('adjacent ranges do not overlap', () => {
      const now = timestamp()
      const first = new DateTimeRange(new PastInfinity(), now)
      const second = new DateTimeRange(now.add(1, 'ms'), new FutureInfinity())

      expect(first.overlaps(second)).toBe(false)
      expect(second.overlaps(first)).toBe(false)
    })

    it('non overlapping ranges do not overlap', () => {
      const now = timestamp()
      const first = new DateTimeRange(now.subtract(1, 'week'), now)
      const second = new DateTimeRange(now.add(1, 'year'), now.add(2, 'years'))

      expect(first.overlaps(second)).toBe(false)
      expect(second.overlaps(first)).toBe(false)
    })
  })

  describe('overlap', () => {
    it('overlap between (-infinity, +infinity) and (-infinity, +infinity) is (-infinity, +infinity)', () => {
      const first = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const overlap = first.overlap(second)

      expect(overlap.from.isPastInfinity()).toBe(true)
      expect(overlap.until.isFutureInfinity()).toBe(true)
    })

    it('overlap between (-infinity, today] and (-infinity, +infinity) is (-infinity, today]', () => {
      const now = timestamp()
      const first = new DateTimeRange(new PastInfinity(), now)
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      const overlap = first.overlap(second)

      expect(overlap.from.isPastInfinity()).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [today, +infinity) and (-infinity, +infinity) is [today, +infinity)', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, new FutureInfinity())
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isFutureInfinity()).toBe(true)
    })

    it('overlap between [now, now] and [now, now] is [now, now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now)
      const second = new DateTimeRange(now, now)
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [now, now] and [yesterday, tomorrow] is [now,now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now)
      const second = new DateTimeRange(now.subtract(1, 'day'), now.add(1, 'day'))
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [now, now] and (now -1ms, now + 1ms) is [now,now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now)
      const second = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'), '()')
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [now, now] and [now, now + 1ms) is [now, now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now)
      const second = new DateTimeRange(now, now.add(1, 'ms'), '[)')
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [now, now] and (now -1ms, now] is [now,now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now)
      const second = new DateTimeRange(now.subtract(1, 'ms'), now, '(]')
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between [now, now +1ms] and [now -1ms, now +1ms] is [now,now +1ms]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now, now.add(1, 'ms'))
      const second = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'))
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now.add(1, 'ms'))).toBe(true)
    })

    it('overlap between [now -1ms, now +1ms) and [now -1ms, now +1ms] is [now -1ms, now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'), '[)')
      const second = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'), '[]')
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now.subtract(1, 'ms'))).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })

    it('overlap between (now -1ms, now +1ms) and [now -1ms, now +1ms] is [now, now]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'), '()')
      const second = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'), '[]')
      const overlap = first.overlap(second)

      expect(overlap.from.isSame(now)).toBe(true)
      expect(overlap.until.isSame(now)).toBe(true)
    })
  })

  describe('diff', () => {
    it('diff between (-infinity, +infinity) and (-infinity, +infinity) is none', () => {
      const first = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, now] and (-infinity, +infinity) is none', () => {
      const first = new DateTimeRange(new PastInfinity(), timestamp())
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between [now, now] and (-infinity, +infinity) is none', () => {
      const first = new DateTimeRange(timestamp(), timestamp())
      const second = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      expect(first.diff(second)).toHaveLength(0)
    })

    it('diff between (-infinity, +infinity) and (-infinity, now] is [now + 1ms, +infinity)', () => {
      const now = timestamp()
      const first = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const second = new DateTimeRange(new PastInfinity(), now)

      const expectedRange = new DateTimeRange(now.add(1, 'ms'), new FutureInfinity())
      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [now, +infinity) is (-infinity, now -1ms]', () => {
      const now = timestamp()
      const first = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const second = new DateTimeRange(now, new FutureInfinity())

      const expectedRange = new DateTimeRange(new PastInfinity(), now.subtract(1, 'ms'))
      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(expectedRange)).toBe(true)
    })

    it('diff between (-infinity, +infinity) and [now, now] is (-infinity, now -1ms] and [now +1ms, +infinity)', () => {
      const now = timestamp()
      const first = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const second = new DateTimeRange(now, now)

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].isSame(new DateTimeRange(new PastInfinity(), now.subtract(1, 'ms')))).toBe(true)
      expect(diff[1].isSame(new DateTimeRange(now.add(1, 'ms'), new FutureInfinity())))
        .toBe(true)
    })

    it('diff between [now -1ms, now +1ms] and [now, now] is [now -1ms, now -1ms] and [now +1ms, now +1ms]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now.subtract(1, 'ms'), now.add(1, 'ms'))
      const second = new DateTimeRange(timestamp(), timestamp())

      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].isSame(new DateTimeRange(now.subtract(1, 'ms'), now.subtract(1, 'ms')))).toBe(true)
      expect(diff[1].isSame(new DateTimeRange(now.add(1, 'ms'), now.add(1, 'ms')))).toBe(true)
    })

    it('diff between [yesterday, today] and [tomorrow, +infinity) is [yesterday, today]', () => {
      const now = timestamp()
      const first = new DateTimeRange(now.subtract(1, 'day'), now)
      const second = new DateTimeRange(now.add(1, 'day'), new FutureInfinity())

      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].isSame(first)).toBe(true)
    })
  })
  describe('startsAfter', () => {
    it('returns true if the date is before the start of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'hour'))

      expect(range.startsAfter(now.subtract(1, 'second'))).toBe(true)
    })

    it('returns false if the date is equal to the start of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'hour'))

      expect(range.startsAfter(now)).toBe(false)
    })

    it('returns false if the date is after the start of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'hour'))

      expect(range.startsAfter(now.add(1, 'second'))).toBe(false)
    })

    it('accepts Date objects as argument', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'))

      expect(range.startsAfter(now.subtract(1, 'second').toDate())).toBe(true)
    })
  })

  describe('endsBefore', () => {
    it('returns true if the date is after the end of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'))

      expect(range.endsBefore(now.add(2, 'ms'))).toBe(true)
    })

    it('returns false if the date is equal to the end of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'))

      expect(range.endsBefore(now.add(1, 'ms'))).toBe(false)
    })

    it('returns false if the date is before the end of the range', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(2, 'ms'))

      expect(range.endsBefore(now.add(1, 'ms'))).toBe(false)
    })

    it('accepts Date objects as argument', () => {
      const now = timestamp()
      const range = new DateTimeRange(now, now.add(1, 'ms'))

      expect(range.endsBefore(now.add(2, 'ms').toDate())).toBe(true)
    })
  })

  describe('toString', () => {
    it('returns string with and inclusive lower and exclusive upper for finite ranges', () => {
      const now = timestamp()
      const later = now.add(1, 'hour')
      const range = new DateTimeRange(now, later)

      expect(range.toString()).toBe(`[${now.toISOString()},${later.add(1, 'ms').toISOString()})`)
    })

    it('returns string with exclusive start if start is infinity', () => {
      const start = new PastInfinity()
      const now = timestamp()
      const range = new DateTimeRange(start, now)

      expect(range.toString()).toBe(`(${start.toISOString()},${now.add(1, 'ms').toISOString()})`)
    })

    it('returns string with exclusive end if end is infinity', () => {
      const now = timestamp()
      const end = new FutureInfinity()
      const range = new DateTimeRange(now, end)

      expect(range.toString()).toBe(`[${now.toISOString()},${end.toISOString()})`)
    })

    it('returns string with exclusive brackets if both start and end are infinity', () => {
      const start = new PastInfinity()
      const end = new FutureInfinity()
      const range = new DateTimeRange(start, end)

      expect(range.toString()).toBe(`(${start.toISOString()},${end.toISOString()})`)
    })
  })

  describe('setUntil', () => {
    it('returns a new DateTimeRange with updated until', () => {
      const now = timestamp()
      const later = now.add(1, 'minute')
      const range = new DateTimeRange(now, later)
      const newUntil = now.add(2, 'minute')

      const newRange = range.setUntil(newUntil)

      expect(newRange.from.isSame(range.from)).toBe(true)
      expect(newRange.until.isSame(newUntil)).toBe(true)
    })

    it('accepts Date objects as input', () => {
      const now = timestamp()
      const later = now.add(1, 'minute')
      const range = new DateTimeRange(now, later)
      const newUntil = now.add(2, 'minute').toDate()

      const newRange = range.setUntil(newUntil)

      expect(newRange.until.isSame(timestamp(newUntil))).toBe(true)
    })
  })

  describe('setFrom', () => {
    it('returns a new DateTimeRange with updated from', () => {
      const now = timestamp()
      const later = now.add(2, 'minute')
      const range = new DateTimeRange(now, later)
      const newFrom = now.subtract(1, 'minute')

      const newRange = range.setFrom(newFrom)

      expect(newRange.from.isSame(newFrom)).toBe(true)
      expect(newRange.until.isSame(range.until)).toBe(true)
    })

    it('accepts Date objects as input', () => {
      const now = timestamp()
      const later = now.add(2, 'minute')
      const range = new DateTimeRange(now, later)
      const newFrom = now.subtract(1, 'minute').toDate()

      const newRange = range.setFrom(newFrom)

      expect(newRange.from.isSame(timestamp(newFrom))).toBe(true)
    })
  })

  describe('precedes', () => {
    it('returns true if this.until + 1ms is same as other.from and this.until is not future infinity', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), now.add(2, 'second'))

      expect(range1.precedes(range2)).toBe(true)
    })

    it('returns false if this.until is future infinity', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, new FutureInfinity())
      const range2 = new DateTimeRange(now.add(100, 'ms'), now.add(200, 'ms'))

      expect(range1.precedes(range2)).toBe(false)
    })

    it('returns false if this.until + 1ms is not same as other.from', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(2, 'second'), now.add(3, 'second'))

      expect(range1.precedes(range2)).toBe(false)
    })
  })

  describe('isPrecededBy', () => {
    it('returns true if other.precedes(this) is true', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.subtract(1, 'second'), now.subtract(1, 'ms'))

      expect(range1.isPrecededBy(range2)).toBe(true)
    })

    it('returns false if other.precedes(this) is false', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.subtract(1, 'second'), now.subtract(1, 'ms'))

      expect(range1.isPrecededBy(range2)).toBe(true)
    })
  })

  describe('succeeds', () => {
    it('returns true if this.from - 1ms is same as other.until and this.from is not past infinity', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), new FutureInfinity())

      expect(range2.succeeds(range1)).toBe(true)
    })

    it('returns false if the range does not succeed it', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(new PastInfinity(), now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(2, 'seconds'), new FutureInfinity())

      expect(range2.succeeds(range1)).toBe(false)
    })
  })

  describe('isSucceededBy', () => {
    it('returns true if other.succeeds(this) is true', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), new FutureInfinity())

      expect(range1.isSucceededBy(range2)).toBe(true)
    })

    it('a range does not succeed itself', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))

      expect(range1.isSucceededBy(range1)).toBe(false)
    })

    it('returns false if the range is not succeeded', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(new PastInfinity(), now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(2, 'seconds'), new FutureInfinity())

      expect(range1.isSucceededBy(range2)).toBe(false)
    })
  })

  describe('isAdjacentTo', () => {
    it('returns true if ranges are adjacent (precedes)', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), now.add(2, 'second'))

      expect(range1.isAdjacentTo(range2)).toBe(true)
    })

    it('returns true if ranges are adjacent (succeeds)', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.subtract(2, 'seconds'), now.subtract(1, 'ms'))

      expect(range2.isAdjacentTo(range1)).toBe(true)
    })

    it('returns false if ranges are not adjacent', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(3, 'second'), now.add(4, 'second'))

      expect(range1.isAdjacentTo(range2)).toBe(false)
      expect(range2.isAdjacentTo(range1)).toBe(false)
    })

    it('a range is not adjacent to itself', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))

      expect(range1.isAdjacentTo(range1)).toBe(false)
    })
  })

  describe('merge', () => {
    it('merges when other range precedes this range (sets from)', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), now.add(2, 'second'))
      const range2 = new DateTimeRange(now, now.add(1, 'second'))

      const merged = range1.merge(range2)

      expect(merged.from.isSame(range2.from)).toBe(true)
      expect(merged.until.isSame(range1.until)).toBe(true)
    })

    it('merges when other range succeeds this range (sets until)', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(1, 'second').add(1, 'ms'), new FutureInfinity())

      const merged = range1.merge(range2)

      expect(merged.from.isSame(range1.from)).toBe(true)
      expect(merged.until.isSame(range2.until)).toBe(true)
    })

    it('throws if ranges are not adjacent', () => {
      const now = timestamp()
      const range1 = new DateTimeRange(now, now.add(1, 'second'))
      const range2 = new DateTimeRange(now.add(3, 'second'), now.add(4, 'second'))

      expect(() => range1.merge(range2)).toThrow('cannot merge non adjacent date time ranges')
    })
  })

  describe('timestamp factory', () => {
    it('creates a FutureInfinity when given Infinity', () => {
      const result = timestamp(Infinity)

      expect(result instanceof FutureInfinity).toBe(true)
      expect(result.isFutureInfinity()).toBe(true)
    })

    it('creates a PastInfinity when given -Infinity', () => {
      const result = timestamp(-Infinity)

      expect(result instanceof PastInfinity).toBe(true)
      expect(result.isPastInfinity()).toBe(true)
    })

    it('creates a FutureInfinity when given the string "infinity"', () => {
      const result = timestamp('infinity')

      expect(result instanceof FutureInfinity).toBe(true)
      expect(result.isFutureInfinity()).toBe(true)
    })

    it('creates a FutureInfinity when given the string "+infinity"', () => {
      const result = timestamp('+infinity')

      expect(result instanceof FutureInfinity).toBe(true)
      expect(result.isFutureInfinity()).toBe(true)
    })

    it('creates a PastInfinity when given the string "-infinity"', () => {
      const result = timestamp('-infinity')

      expect(result instanceof PastInfinity).toBe(true)
      expect(result.isPastInfinity()).toBe(true)
    })

    it('creates a null when given null', () => {
      const result = timestamp(null)

      expect(result).toBe(null)
    })

    it('creates a DayjsTimestamp when given a valid date string', () => {
      const result = timestamp('2025-01-01T00:00:00Z')

      expect(result instanceof FutureInfinity).toBe(false)
      expect(result instanceof PastInfinity).toBe(false)
      expect(result.isFutureInfinity()).toBe(false)
      expect(result.isPastInfinity()).toBe(false)
    })
  })
})
