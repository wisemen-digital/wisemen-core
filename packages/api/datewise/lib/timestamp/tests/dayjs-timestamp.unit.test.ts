import { describe, before, it } from 'node:test'
import { expect } from 'expect'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { initDayjs } from '../../common/init-dayjs.js'
import { timestamp } from '../index.js'
import { plainDate } from '../../plain-date/index.js'
import { plainTime } from '../../plain-time/plain-time-entry.js'
import { MILLIS_PER_SECOND } from '../../common/constants.js'

describe('DayjsTimestamp', () => {
  before(() => initDayjs())

  it('sets the timezone on a new timestamp', () => {
    const brusselsTs = timestamp(plainDate('2025-12-10'), plainTime('12:00:00'), 'Europe/Brussels')
    const utcTs = brusselsTs.setTimezone('UTC')

    expect(brusselsTs.toISOString()).toBe('2025-12-10T11:00:00.000Z')
    expect(utcTs.toISOString()).toBe('2025-12-10T11:00:00.000Z')

    expect(brusselsTs.format()).toBe('2025-12-10T12:00:00+01:00')
    expect(utcTs.format()).toBe('2025-12-10T11:00:00Z')
  })

  describe('time conversion methods', () => {
    it('getTime returns milliseconds since Unix Epoch', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const timeMs = ts.getTime()

      expect(typeof timeMs).toBe('number')
      expect(timeMs).toBeGreaterThan(0)
      expect(timeMs).toBe(1735689600000)
    })

    it('getTime is an alias for valueOf', () => {
      const ts = timestamp('2025-06-15T14:30:45.123Z')

      expect(ts.getTime()).toBe(ts.valueOf())
    })

    it('valueOf returns milliseconds since Unix Epoch', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const timeMs = ts.valueOf()

      expect(typeof timeMs).toBe('number')
      expect(timeMs).toBe(1735689600000)
    })

    it('unix returns seconds since Unix Epoch', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const timeSec = ts.unix()

      expect(typeof timeSec).toBe('number')
      expect(timeSec).toBe(1735689600)
      expect(timeSec).toBe(Math.floor(ts.getTime() / MILLIS_PER_SECOND))
    })

    it('toDate returns a Date object with same timestamp', () => {
      const ts = timestamp('2025-03-20T10:15:30.500Z')
      const date = ts.toDate()

      expect(date).toBeInstanceOf(Date)
      expect(date.getTime()).toBe(ts.getTime())
    })

    it('getTime consistency across different construction methods', () => {
      const ts1 = timestamp('2025-06-20T15:45:30Z')
      const ts2 = timestamp(new Date('2025-06-20T15:45:30Z'))

      expect(ts1.getTime()).toBe(ts2.getTime())
    })
  })

  describe('duration methods', () => {
    it('addDuration adds the duration to the timestamp', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const duration = new Duration(5, DurationUnit.MINUTES)
      const result = ts.addDuration(duration)

      expect(result.getTime()).toBe(ts.getTime() + 5 * 60 * 1000)
    })

    it('addDuration returns a new Timestamp instance', () => {
      const ts = timestamp('2025-01-01T12:00:00Z')
      const duration = new Duration(1, DurationUnit.SECONDS)
      const result = ts.addDuration(duration)

      expect(result).not.toBe(ts)
      expect(result.getTime()).not.toBe(ts.getTime())
    })

    it('subtractDuration subtracts the duration from the timestamp', () => {
      const ts = timestamp('2025-01-01T00:10:00Z')
      const duration = new Duration(5, DurationUnit.MINUTES)
      const result = ts.subtractDuration(duration)

      expect(result.getTime()).toBe(ts.getTime() - 5 * 60 * 1000)
    })

    it('subtractDuration returns a new Timestamp instance', () => {
      const ts = timestamp('2025-01-01T12:00:00Z')
      const duration = new Duration(1, DurationUnit.SECONDS)
      const result = ts.subtractDuration(duration)

      expect(result).not.toBe(ts)
      expect(result.getTime()).not.toBe(ts.getTime())
    })

    it('subtractDuration produces correct time after subtraction', () => {
      const ts = timestamp('2025-01-01T12:30:45.500Z')
      const oneMs = new Duration(1, DurationUnit.MILLISECONDS)
      const result = ts.subtractDuration(oneMs)

      expect(result.getTime()).toBe(ts.getTime() - 1)
      expect(result.toISOString()).toBe('2025-01-01T12:30:45.499Z')
    })

    it('addDuration and subtractDuration are inverse operations', () => {
      const ts = timestamp('2025-06-15T14:30:45.123Z')
      const duration = new Duration(3, DurationUnit.MINUTES)

      const added = ts.addDuration(duration)
      const result = added.subtractDuration(duration)

      expect(result.getTime()).toBe(ts.getTime())
    })

    it('subtractDuration with large duration', () => {
      const ts = timestamp('2025-12-31T23:59:59.999Z')
      const oneDay = new Duration(24, DurationUnit.HOURS)
      const result = ts.subtractDuration(oneDay)

      expect(result.getTime()).toBe(ts.getTime() - 24 * 60 * 60 * 1000)
      expect(result.toISOString()).toBe('2025-12-30T23:59:59.999Z')
    })
  })

  describe('until and since', () => {
    it('returns zero duration when compared to itself', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const until = ts.until(ts)
      const since = ts.since(ts)

      expect(until.milliseconds).toBe(0)
      expect(since.milliseconds).toBe(0)
    })

    it('returns positive duration for future timestamps', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const future = timestamp('2025-01-01T00:00:01Z')
      const duration = ts.until(future)

      expect(duration.milliseconds).toBe(1000)
    })

    it('returns negative duration for past timestamps', () => {
      const ts = timestamp('2025-01-01T00:00:01Z')
      const past = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.until(past)

      expect(duration.milliseconds).toBe(-1000)
    })

    it('returns negative duration for future timestamps with since', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const future = timestamp('2025-01-01T00:00:01Z')
      const duration = ts.since(future)

      expect(duration.milliseconds).toBe(-1000)
    })

    it('returns positive duration for past timestamps with since', () => {
      const ts = timestamp('2025-01-01T00:00:01Z')
      const past = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.since(past)

      expect(duration.milliseconds).toBe(1000)
    })

    it('until and since are opposites', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const other = timestamp('2025-01-01T00:00:10Z')

      expect(ts.until(other).milliseconds).toBe(-ts.since(other).milliseconds)
    })

    it('until returns infinity when compared to future infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.until('infinity')

      expect(duration.milliseconds).toBe(Infinity)
    })

    it('until returns negative infinity when compared to past infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.until('-infinity')

      expect(duration.milliseconds).toBe(-Infinity)
    })

    it('since returns negative infinity when compared to future infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.since('infinity')

      expect(duration.milliseconds).toBe(-Infinity)
    })

    it('since returns infinity when compared to past infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const duration = ts.since('-infinity')

      expect(duration.milliseconds).toBe(Infinity)
    })
  })
})
