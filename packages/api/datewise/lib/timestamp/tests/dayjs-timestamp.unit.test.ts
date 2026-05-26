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

  describe('diff', () => {
    it('returns 0 when comparing a timestamp to itself', () => {
      const ts = timestamp('2025-01-01T12:00:00Z')
      const result = ts.diff(ts, 'milliseconds')

      expect(result).toBe(0)
    })

    it('returns negative infinity when diffing with future infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const result = ts.diff('infinity', 'milliseconds')

      expect(result).toBe(-Infinity)
    })

    it('returns positive infinity when diffing with past infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const result = ts.diff('-infinity', 'milliseconds')

      expect(result).toBe(Infinity)
    })

    it('returns negative infinity for all units when diffing with future infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')

      expect(ts.diff('infinity', 'seconds')).toBe(-Infinity)
      expect(ts.diff('infinity', 'minutes')).toBe(-Infinity)
      expect(ts.diff('infinity', 'hours')).toBe(-Infinity)
      expect(ts.diff('infinity', 'days')).toBe(-Infinity)
      expect(ts.diff('infinity', 'months')).toBe(-Infinity)
      expect(ts.diff('infinity', 'years')).toBe(-Infinity)
    })

    it('returns positive infinity for all units when diffing with past infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')

      expect(ts.diff('-infinity', 'seconds')).toBe(Infinity)
      expect(ts.diff('-infinity', 'minutes')).toBe(Infinity)
      expect(ts.diff('-infinity', 'hours')).toBe(Infinity)
      expect(ts.diff('-infinity', 'days')).toBe(Infinity)
      expect(ts.diff('-infinity', 'months')).toBe(Infinity)
      expect(ts.diff('-infinity', 'years')).toBe(Infinity)
    })

    it('correctly diffs milliseconds between regular timestamps', () => {
      const ts1 = timestamp('2025-01-01T00:00:00.000Z')
      const ts2 = timestamp('2025-01-01T00:00:01.500Z')
      const result = ts1.diff(ts2, 'milliseconds')

      expect(result).toBe(-1500)
    })

    it('diff with precise flag handles infinities', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')

      expect(ts.diff('infinity', 'milliseconds', true)).toBe(-Infinity)
      expect(ts.diff('-infinity', 'milliseconds', true)).toBe(Infinity)
    })
  })

  describe('compare', () => {
    it('returns 0 when comparing a timestamp to itself', () => {
      const ts = timestamp('2025-01-01T12:00:00Z')
      const result = ts.compare(ts)

      expect(result).toBe(0)
    })

    it('returns 0 when comparing identical timestamps', () => {
      const ts1 = timestamp('2025-01-01T12:00:00Z')
      const ts2 = timestamp('2025-01-01T12:00:00Z')
      const result = ts1.compare(ts2)

      expect(result).toBe(0)
    })

    it('returns negative value when this timestamp is before the other', () => {
      const earlier = timestamp('2025-01-01T12:00:00Z')
      const later = timestamp('2025-01-01T12:00:01Z')
      const result = earlier.compare(later)

      expect(result).toBeLessThan(0)
      expect(result).toBe(-1000)
    })

    it('returns positive value when this timestamp is after the other', () => {
      const later = timestamp('2025-01-01T12:00:01Z')
      const earlier = timestamp('2025-01-01T12:00:00Z')
      const result = later.compare(earlier)

      expect(result).toBeGreaterThan(0)
      expect(result).toBe(1000)
    })

    it('returns negative infinity when compared to future infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const result = ts.compare('infinity')

      expect(result).toBe(-Infinity)
    })

    it('returns positive infinity when compared to past infinity', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const result = ts.compare('-infinity')

      expect(result).toBe(Infinity)
    })

    it('returns exact millisecond difference', () => {
      const ts1 = timestamp('2025-01-01T12:00:00.000Z')
      const ts2 = timestamp('2025-01-01T12:00:00.500Z')
      const result = ts1.compare(ts2)

      expect(result).toBe(-500)
    })

    it('can be used to sort timestamps in ascending order', () => {
      const timestamps = [
        timestamp('2025-03-01T00:00:00Z'),
        timestamp('2025-01-01T00:00:00Z'),
        timestamp('2025-02-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].toISOString()).toBe('2025-01-01T00:00:00.000Z')
      expect(timestamps[1].toISOString()).toBe('2025-02-01T00:00:00.000Z')
      expect(timestamps[2].toISOString()).toBe('2025-03-01T00:00:00.000Z')
    })

    it('can be used to sort timestamps in descending order', () => {
      const timestamps = [
        timestamp('2025-01-01T00:00:00Z'),
        timestamp('2025-03-01T00:00:00Z'),
        timestamp('2025-02-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => b.compare(a))

      expect(timestamps[0].toISOString()).toBe('2025-03-01T00:00:00.000Z')
      expect(timestamps[1].toISOString()).toBe('2025-02-01T00:00:00.000Z')
      expect(timestamps[2].toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })

    it('can sort timestamps with past infinity at the start', () => {
      const timestamps = [
        timestamp('2025-03-01T00:00:00Z'),
        timestamp('-infinity'),
        timestamp('2025-01-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].isPastInfinity()).toBe(true)
      expect(timestamps[1].toISOString()).toBe('2025-01-01T00:00:00.000Z')
      expect(timestamps[2].toISOString()).toBe('2025-03-01T00:00:00.000Z')
    })

    it('can sort timestamps with future infinity at the end', () => {
      const timestamps = [
        timestamp('2025-01-01T00:00:00Z'),
        timestamp('infinity'),
        timestamp('2025-03-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].toISOString()).toBe('2025-01-01T00:00:00.000Z')
      expect(timestamps[1].toISOString()).toBe('2025-03-01T00:00:00.000Z')
      expect(timestamps[2].isFutureInfinity()).toBe(true)
    })

    it('can sort timestamps with both infinities', () => {
      const timestamps = [
        timestamp('2025-02-01T00:00:00Z'),
        timestamp('infinity'),
        timestamp('-infinity'),
        timestamp('2025-01-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].isPastInfinity()).toBe(true)
      expect(timestamps[1].toISOString()).toBe('2025-01-01T00:00:00.000Z')
      expect(timestamps[2].toISOString()).toBe('2025-02-01T00:00:00.000Z')
      expect(timestamps[3].isFutureInfinity()).toBe(true)
    })

    it('returns consistent results with isBefore when comparing with infinities', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const futureInfinity = timestamp('infinity')
      const pastInfinity = timestamp('-infinity')

      // compare < 0 should match isBefore = true
      expect(ts.compare(futureInfinity) < 0).toBe(ts.isBefore(futureInfinity))
      expect(ts.compare(pastInfinity) < 0).toBe(ts.isBefore(pastInfinity))
    })

    it('returns consistent results with isAfter when comparing with infinities', () => {
      const ts = timestamp('2025-01-01T00:00:00Z')
      const futureInfinity = timestamp('infinity')
      const pastInfinity = timestamp('-infinity')

      // compare > 0 should match isAfter = true
      expect(ts.compare(futureInfinity) > 0).toBe(ts.isAfter(futureInfinity))
      expect(ts.compare(pastInfinity) > 0).toBe(ts.isAfter(pastInfinity))
    })

    it('handles multiple regular timestamps mixed with infinities in complex sort', () => {
      const timestamps = [
        timestamp('2025-06-01T00:00:00Z'),
        timestamp('infinity'),
        timestamp('2025-01-15T00:00:00Z'),
        timestamp('-infinity'),
        timestamp('2025-12-31T23:59:59Z'),
        timestamp('2025-03-20T12:30:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].isPastInfinity()).toBe(true)
      expect(timestamps[1].toISOString()).toBe('2025-01-15T00:00:00.000Z')
      expect(timestamps[2].toISOString()).toBe('2025-03-20T12:30:00.000Z')
      expect(timestamps[3].toISOString()).toBe('2025-06-01T00:00:00.000Z')
      expect(timestamps[4].toISOString()).toBe('2025-12-31T23:59:59.000Z')
      expect(timestamps[5].isFutureInfinity()).toBe(true)
    })

    it('compare with future infinity from different timestamp formats', () => {
      const ts1 = timestamp(new Date('2025-01-01T00:00:00Z'))
      const ts2 = timestamp('2025-01-01T00:00:00Z')
      const futureInfinity = timestamp('infinity')

      expect(ts1.compare(futureInfinity)).toBe(-Infinity)
      expect(ts2.compare(futureInfinity)).toBe(-Infinity)
    })

    it('compare with past infinity from different timestamp formats', () => {
      const ts1 = timestamp(new Date('2025-01-01T00:00:00Z'))
      const ts2 = timestamp('2025-01-01T00:00:00Z')
      const pastInfinity = timestamp('-infinity')

      expect(ts1.compare(pastInfinity)).toBe(Infinity)
      expect(ts2.compare(pastInfinity)).toBe(Infinity)
    })
  })
})
