import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import dayjs from 'dayjs'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainTime } from '../plain-time-entry.js'
import { InvalidPlainTimeString, InvalidAbsoluteMilliseconds } from '../plain-time-error.js'
import { PlainTimeImpl } from '../plain-time.js'

describe('PlainTime', () => {
  before(() => {
    initDayjs()
  })

  describe('isValidTimeString', () => {
    it('When sending null, it should return false', () => {
      expect(plainTime.isValidTimeString(null)).toBe(false)
    })

    it('When sending undefined, it should return false', () => {
      expect(plainTime.isValidTimeString(undefined)).toBe(false)
    })

    it('When sending an empty string, it should return false', () => {
      expect(plainTime.isValidTimeString('')).toBe(false)
    })

    it('When sending an invalid time string, it should return false', () => {
      expect(plainTime.isValidTimeString('24:00:01')).toBe(false)
      expect(plainTime.isValidTimeString('00:60:00')).toBe(false)
      expect(plainTime.isValidTimeString('00:00:60')).toBe(false)
      expect(plainTime.isValidTimeString('0:0:0')).toBe(false)
      expect(plainTime.isValidTimeString('1:1:1')).toBe(false)
      expect(plainTime.isValidTimeString('1:1')).toBe(false)
      expect(plainTime.isValidTimeString('25:00')).toBe(false)
      expect(plainTime.isValidTimeString('24:01')).toBe(false)
      expect(plainTime.isValidTimeString('00:60')).toBe(false)
    })

    it('When sending a valid time string, it should return true', () => {
      expect(plainTime.isValidTimeString('24:00:00')).toBe(true)
      expect(plainTime.isValidTimeString('23:59:59')).toBe(true)
      expect(plainTime.isValidTimeString('00:00:00')).toBe(true)
      expect(plainTime.isValidTimeString('10:10:10')).toBe(true)
      expect(plainTime.isValidTimeString('24:00')).toBe(true)
      expect(plainTime.isValidTimeString('00:00')).toBe(true)
      expect(plainTime.isValidTimeString('12:34')).toBe(true)
    })
  })

  describe('new Time()', () => {
    it('for an invalid string, it throws an error', () => {
      expect(() => new PlainTimeImpl('')).toThrow(InvalidPlainTimeString)
      expect(() => new PlainTimeImpl('not_a_time')).toThrow(InvalidPlainTimeString)
      expect(() => new PlainTimeImpl('00:60:00')).toThrow(InvalidPlainTimeString)
      expect(() => new PlainTimeImpl('00:00:60')).toThrow(InvalidPlainTimeString)
      expect(() => new PlainTimeImpl('0:0:0')).toThrow(InvalidPlainTimeString)
    })

    it('for a valid string, the constructed Time object contains the right values', () => {
      const time = new PlainTimeImpl('23:30:00')

      expect(time.hours()).toBe(23)
      expect(time.minutes()).toBe(30)
      expect(time.seconds()).toBe(0)
    })

    it('Throws an error when invalid values are provided', () => {
      expect(() => new PlainTimeImpl(NaN)).toThrow(InvalidAbsoluteMilliseconds)
      expect(() => new PlainTimeImpl(Infinity)).toThrow(InvalidAbsoluteMilliseconds)
      expect(() => new PlainTimeImpl(-Infinity)).toThrow(InvalidAbsoluteMilliseconds)
      expect(() => new PlainTimeImpl(-1)).toThrow(InvalidAbsoluteMilliseconds)
    })

    it('When creating a time with a string, it creates the correct time', () => {
      const time = new PlainTimeImpl('23:59:59')

      expect(time.hours()).toBe(23)
      expect(time.minutes()).toBe(59)
      expect(time.seconds()).toBe(59)

      const midnight = new PlainTimeImpl('00:00:00')

      expect(midnight.hours()).toBe(0)
      expect(midnight.minutes()).toBe(0)
      expect(midnight.seconds()).toBe(0)

      const shortTime = new PlainTimeImpl('23:59')

      expect(shortTime.hours()).toBe(23)
      expect(shortTime.minutes()).toBe(59)
      expect(shortTime.seconds()).toBe(0)

      const shortMidnight = new PlainTimeImpl('00:00')

      expect(shortMidnight.hours()).toBe(0)
      expect(shortMidnight.minutes()).toBe(0)
      expect(shortMidnight.seconds()).toBe(0)
    })

    it('When creating a time with an object, it creates the correct time', () => {
      const time = new PlainTimeImpl({ hours: 23, minutes: 59, seconds: 59, milliseconds: 999 })

      expect(time.hours()).toBe(23)
      expect(time.minutes()).toBe(59)
      expect(time.seconds()).toBe(59)

      const midnight = new PlainTimeImpl({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })

      expect(midnight.hours()).toBe(0)
      expect(midnight.minutes()).toBe(0)
      expect(midnight.seconds()).toBe(0)
    })

    it('When creating a time with a date, it creates the correct time', () => {
      const date = dayjs.tz('2024-01-01 10:13:42', 'Europe/Brussels').toDate()
      const time = new PlainTimeImpl(date)

      expect(time.hours()).toBe(10)
      expect(time.minutes()).toBe(13)
      expect(time.seconds()).toBe(42)
    })

    it('When creating a time with absolute milliseconds, it creates the correct time', () => {
      const time = new PlainTimeImpl(86399001)

      expect(time.hours()).toBe(23)
      expect(time.minutes()).toBe(59)
      expect(time.seconds()).toBe(59)
      expect(time.milliseconds()).toBe(1)

      const noon = new PlainTimeImpl(43200000)

      expect(noon.hours()).toBe(12)
      expect(noon.minutes()).toBe(0)
      expect(noon.seconds()).toBe(0)
      expect(noon.milliseconds()).toBe(0)

      const midnight = new PlainTimeImpl(0)

      expect(midnight.hours()).toBe(0)
      expect(midnight.minutes()).toBe(0)
      expect(midnight.seconds()).toBe(0)
      expect(midnight.milliseconds()).toBe(0)
    })
  })

  describe('toString', () => {
    it('When converting a Time to a string, it should return the correct format', () => {
      expect(new PlainTimeImpl({ hours: 23, minutes: 59, seconds: 59, milliseconds: 999 }).toString()).toBe('23:59:59.999')
      expect(new PlainTimeImpl(0).toString()).toBe('00:00:00.000')
      expect(new PlainTimeImpl('05:23:58').toString()).toBe('05:23:58.000')
    })
  })

  describe('isBefore', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = new PlainTimeImpl('10:10:10')
      const otherTime = new PlainTimeImpl('20:20:20')

      expect(time.isBefore(time)).toBe(false)
      expect(time.isBefore(otherTime)).toBe(true)
      expect(otherTime.isBefore(time)).toBe(false)
    })
  })

  describe('isBeforeOrEqual', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = new PlainTimeImpl('10:10:10')
      const otherTime = new PlainTimeImpl('20:20:20')

      expect(time.isSameOrBefore(time)).toBe(true)
      expect(time.isSameOrBefore(otherTime)).toBe(true)
      expect(otherTime.isSameOrBefore(time)).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = new PlainTimeImpl('10:10:10')
      const otherTime = new PlainTimeImpl('20:20:20')

      expect(time.isAfter(time)).toBe(false)
      expect(time.isAfter(otherTime)).toBe(false)
      expect(otherTime.isAfter(time)).toBe(true)
    })
  })

  describe('isAfterOrEqual', () => {
    it('When comparing times, it should determine the order correctly', () => {
      const time = new PlainTimeImpl('10:10:10')
      const otherTime = new PlainTimeImpl('20:20:20')

      expect(time.isSameOrAfter(time)).toBe(true)
      expect(time.isSameOrAfter(otherTime)).toBe(false)
      expect(otherTime.isSameOrAfter(time)).toBe(true)
    })
  })

  describe('isBetween', () => {
    it('Time between two inclusive boundaries returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound)).toBe(true)
    })

    it('Time same as both inclusive boundaries returns true', () => {
      const lowerBound = new PlainTimeImpl('12:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound)).toBe(true)
    })

    it('Time same as lower boundary between two inclusive boundaries returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('00:00:00')

      expect(time.isBetween(lowerBound, upperBound)).toBe(true)
    })

    it('Time same as upper boundary between two inclusive boundaries returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('23:59:59')

      expect(time.isBetween(lowerBound, upperBound)).toBe(true)
    })

    it('Time before two inclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:01')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound)).toBe(false)
    })

    it('Time after two inclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('11:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:01')

      expect(time.isBetween(lowerBound, upperBound)).toBe(false)
    })

    it('Time between two exclusive boundaries returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(true)
    })

    it('Time same as both exclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(false)
    })

    it('Time same as lower boundary between two exclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('00:00:00')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(false)
    })

    it('Time same as upper boundary between two exclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('23:59:59')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(false)
    })

    it('Time before two exclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:01')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(false)
    })

    it('Time after two exclusive boundaries returns false', () => {
      const lowerBound = new PlainTimeImpl('11:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:01')

      expect(time.isBetween(lowerBound, upperBound, '()')).toBe(false)
    })

    it('Time between an exclusive lowerbound and inclusive upperbound returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(true)
    })

    it('Time same as both an exclusive lowerbound and inclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(false)
    })

    it('Time same as lower boundary between an exclusive lowerbound and inclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('00:00:00')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(false)
    })

    it('Time same as upper boundary between an exclusive lowerbound and inclusive upperbound returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('23:59:59')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(true)
    })

    it('Time before an exclusive lowerbound and inclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:01')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(false)
    })

    it('Time after an exclusive lowerbound and inclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('11:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:01')

      expect(time.isBetween(lowerBound, upperBound, '(]')).toBe(false)
    })

    it('Time between an inclusive lowerbound and exclusive upperbound returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(true)
    })

    it('Time same as both an inclusive lowerbound and exclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(false)
    })

    it('Time same as lower boundary between an inclusive lowerbound and exclusive upperbound returns true', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('00:00:00')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(true)
    })

    it('Time same as upper boundary between an inclusive lowerbound and exclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('00:00:00')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('23:59:59')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(false)
    })

    it('Time before an inclusive lowerbound and exclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('12:00:01')
      const upperBound = new PlainTimeImpl('23:59:59')
      const time = new PlainTimeImpl('12:00:00')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(false)
    })

    it('Time after an inclusive lowerbound and exclusive upperbound returns false', () => {
      const lowerBound = new PlainTimeImpl('11:00:00')
      const upperBound = new PlainTimeImpl('12:00:00')
      const time = new PlainTimeImpl('12:00:01')

      expect(time.isBetween(lowerBound, upperBound, '[)')).toBe(false)
    })
  })

  describe('equals', () => {
    it('When comparing times, it should determine the equality correctly', () => {
      const time = new PlainTimeImpl('10:10:10')
      const otherTime = new PlainTimeImpl('20:20:20')

      expect(time.isSame(time)).toBe(true)
      expect(time.isSame(otherTime)).toBe(false)
      expect(otherTime.isSame(time)).toBe(false)
    })
  })

  describe('copy', () => {
    it('Creates a new copy of a time object', () => {
      const time = new PlainTimeImpl('10:10:10')
      const copy = time.copy()

      expect(time).not.toBe(copy)
      expect(time.isSame(copy)).toBe(true)
    })
  })

  describe('since', () => {
    it('When the other time is before this time, it calculates the duration correctly', () => {
      const time = new PlainTimeImpl('14:30:00')
      const otherTime = new PlainTimeImpl('10:00:00')

      const duration = time.since(otherTime)

      expect(duration.hours).toBe(4.5)
      expect(duration.minutes).toBe(270)
    })

    it('When the other time is after this time, it wraps around to the next day', () => {
      const time = new PlainTimeImpl('02:00:00')
      const otherTime = new PlainTimeImpl('22:00:00')

      const duration = time.since(otherTime)

      expect(duration.hours).toBe(4)
      expect(duration.minutes).toBe(240)
    })

    it('When both times are the same, it returns a duration of zero', () => {
      const time = new PlainTimeImpl('12:00:00')
      const otherTime = new PlainTimeImpl('12:00:00')

      const duration = time.since(otherTime)

      expect(duration.milliseconds).toBe(0)
      expect(duration.seconds).toBe(0)
    })

    it('When calculating from midnight to noon, it returns 12 hours', () => {
      const time = new PlainTimeImpl('12:00:00')
      const otherTime = new PlainTimeImpl('00:00:00')

      const duration = time.since(otherTime)

      expect(duration.hours).toBe(12)
    })

    it('When calculating from noon to midnight, it wraps around', () => {
      const time = new PlainTimeImpl('00:00:00')
      const otherTime = new PlainTimeImpl('12:00:00')

      const duration = time.since(otherTime)

      expect(duration.hours).toBe(12)
    })

    it('When calculating duration with milliseconds precision', () => {
      const time = new PlainTimeImpl('10:00:00.500')
      const otherTime = new PlainTimeImpl('10:00:00.000')

      const duration = time.since(otherTime)

      expect(duration.milliseconds).toBe(500)
    })

    it('When calculating duration across different seconds', () => {
      const time = new PlainTimeImpl('10:05:30')
      const otherTime = new PlainTimeImpl('10:00:15')

      const duration = time.since(otherTime)

      expect(duration.seconds).toBe(315)
      expect(duration.minutes).toBe(5.25)
    })

    it('When other time is one millisecond after this time, it wraps around almost a full day', () => {
      const time = new PlainTimeImpl('10:00:00.000')
      const otherTime = new PlainTimeImpl('10:00:00.001')

      const duration = time.since(otherTime)

      expect(duration.milliseconds).toBe(86399999)
      expect(duration.hours).toBeCloseTo(23.999997, 5)
    })

    it('When calculating from end of day to start of day', () => {
      const time = new PlainTimeImpl('00:00:00')
      const otherTime = new PlainTimeImpl('23:59:59.999')

      const duration = time.since(otherTime)

      expect(duration.milliseconds).toBe(1)
    })

    it('When using string input for other time', () => {
      const time = new PlainTimeImpl('15:00:00')

      const duration = time.since('10:00:00')

      expect(duration.hours).toBe(5)
    })

    it('When using PlainTimeObject input for other time', () => {
      const time = new PlainTimeImpl('15:30:00')

      const duration = time.since({ hours: 10, minutes: 0, seconds: 0, milliseconds: 0 })

      expect(duration.hours).toBe(5.5)
    })
  })

  describe('until', () => {
    it('When the other time is after this time, it calculates the duration correctly', () => {
      const time = new PlainTimeImpl('10:00:00')
      const otherTime = new PlainTimeImpl('14:30:00')

      const duration = time.until(otherTime)

      expect(duration.hours).toBe(4.5)
      expect(duration.minutes).toBe(270)
    })

    it('When the other time is before this time, it wraps around to the next day', () => {
      const time = new PlainTimeImpl('22:00:00')
      const otherTime = new PlainTimeImpl('02:00:00')

      const duration = time.until(otherTime)

      expect(duration.hours).toBe(4)
      expect(duration.minutes).toBe(240)
    })

    it('When both times are the same, it returns a duration of zero', () => {
      const time = new PlainTimeImpl('12:00:00')
      const otherTime = new PlainTimeImpl('12:00:00')

      const duration = time.until(otherTime)

      expect(duration.milliseconds).toBe(0)
      expect(duration.seconds).toBe(0)
    })

    it('When calculating from midnight to noon, it returns 12 hours', () => {
      const time = new PlainTimeImpl('00:00:00')
      const otherTime = new PlainTimeImpl('12:00:00')

      const duration = time.until(otherTime)

      expect(duration.hours).toBe(12)
    })

    it('When calculating from noon to midnight, it wraps around', () => {
      const time = new PlainTimeImpl('12:00:00')
      const otherTime = new PlainTimeImpl('00:00:00')

      const duration = time.until(otherTime)

      expect(duration.hours).toBe(12)
    })

    it('When calculating duration with milliseconds precision', () => {
      const time = new PlainTimeImpl('10:00:00.000')
      const otherTime = new PlainTimeImpl('10:00:00.500')

      const duration = time.until(otherTime)

      expect(duration.milliseconds).toBe(500)
    })

    it('When calculating duration across different seconds', () => {
      const time = new PlainTimeImpl('10:00:15')
      const otherTime = new PlainTimeImpl('10:05:30')

      const duration = time.until(otherTime)

      expect(duration.seconds).toBe(315)
      expect(duration.minutes).toBe(5.25)
    })

    it('When other time is one millisecond before this time, it wraps around almost a full day', () => {
      const time = new PlainTimeImpl('10:00:00.001')
      const otherTime = new PlainTimeImpl('10:00:00.000')

      const duration = time.until(otherTime)

      expect(duration.milliseconds).toBe(86399999)
      expect(duration.hours).toBeCloseTo(23.999997, 5)
    })

    it('When calculating from start of day to end of day', () => {
      const time = new PlainTimeImpl('23:59:59.999')
      const otherTime = new PlainTimeImpl('00:00:00')

      const duration = time.until(otherTime)

      expect(duration.milliseconds).toBe(1)
    })

    it('When using string input for other time', () => {
      const time = new PlainTimeImpl('10:00:00')

      const duration = time.until('15:00:00')

      expect(duration.hours).toBe(5)
    })

    it('When using PlainTimeObject input for other time', () => {
      const time = new PlainTimeImpl('10:00:00')

      const duration = time.until({ hours: 15, minutes: 30, seconds: 0, milliseconds: 0 })

      expect(duration.hours).toBe(5.5)
    })
  })

  describe('add', () => {
    it('When adding duration within the same day, it returns the correct time', () => {
      const time = new PlainTimeImpl('10:00:00')
      const duration = new Duration(2, DurationUnit.HOURS)

      const result = time.add(duration)

      expect(result.hours()).toBe(12)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
    })

    it('When adding duration that wraps to the next day, it wraps correctly', () => {
      const time = new PlainTimeImpl('23:00:00')
      const duration = new Duration(2, DurationUnit.HOURS)

      const result = time.add(duration)

      expect(result.hours()).toBe(1)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
    })

    it('When adding minutes that cross the hour boundary', () => {
      const time = new PlainTimeImpl('10:30:00')
      const duration = new Duration(45, DurationUnit.MINUTES)

      const result = time.add(duration)

      expect(result.hours()).toBe(11)
      expect(result.minutes()).toBe(15)
      expect(result.seconds()).toBe(0)
    })

    it('When adding seconds with milliseconds precision', () => {
      const time = new PlainTimeImpl('10:00:00.500')
      const duration = new Duration(1500, DurationUnit.MILLISECONDS)

      const result = time.add(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(2)
      expect(result.milliseconds()).toBe(0)
    })

    it('When adding exactly 24 hours, it returns the same time', () => {
      const time = new PlainTimeImpl('10:30:00')
      const duration = new Duration(24, DurationUnit.HOURS)

      const result = time.add(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(30)
      expect(result.seconds()).toBe(0)
    })

    it('When adding zero duration, it returns the same time', () => {
      const time = new PlainTimeImpl('15:45:30')
      const duration = new Duration(0, DurationUnit.MILLISECONDS)

      const result = time.add(duration)

      expect(result.isSame(time)).toBe(true)
    })

    it('When adding to midnight', () => {
      const time = new PlainTimeImpl('00:00:00')
      const duration = new Duration(30, DurationUnit.MINUTES)

      const result = time.add(duration)

      expect(result.hours()).toBe(0)
      expect(result.minutes()).toBe(30)
      expect(result.seconds()).toBe(0)
    })

    it('When adding wraps from end of day', () => {
      const time = new PlainTimeImpl('23:59:59.999')
      const duration = new Duration(1, DurationUnit.MILLISECONDS)

      const result = time.add(duration)

      expect(result.hours()).toBe(0)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
      expect(result.milliseconds()).toBe(0)
    })
  })

  describe('subtract', () => {
    it('When subtracting duration within the same day, it returns the correct time', () => {
      const time = new PlainTimeImpl('12:00:00')
      const duration = new Duration(2, DurationUnit.HOURS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
    })

    it('When subtracting duration that wraps to the previous day, it wraps correctly', () => {
      const time = new PlainTimeImpl('01:00:00')
      const duration = new Duration(2, DurationUnit.HOURS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(23)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
    })

    it('When subtracting minutes that cross the hour boundary', () => {
      const time = new PlainTimeImpl('11:15:00')
      const duration = new Duration(45, DurationUnit.MINUTES)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(30)
      expect(result.seconds()).toBe(0)
    })

    it('When subtracting seconds with milliseconds precision', () => {
      const time = new PlainTimeImpl('10:00:02.000')
      const duration = new Duration(1500, DurationUnit.MILLISECONDS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
      expect(result.milliseconds()).toBe(500)
    })

    it('When subtracting exactly 24 hours, it returns the same time', () => {
      const time = new PlainTimeImpl('10:30:00')
      const duration = new Duration(24, DurationUnit.HOURS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(10)
      expect(result.minutes()).toBe(30)
      expect(result.seconds()).toBe(0)
    })

    it('When subtracting zero duration, it returns the same time', () => {
      const time = new PlainTimeImpl('15:45:30')
      const duration = new Duration(0, DurationUnit.MILLISECONDS)

      const result = time.subtract(duration)

      expect(result.isSame(time)).toBe(true)
    })

    it('When subtracting from midnight', () => {
      const time = new PlainTimeImpl('00:00:00')
      const duration = new Duration(30, DurationUnit.MINUTES)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(23)
      expect(result.minutes()).toBe(30)
      expect(result.seconds()).toBe(0)
    })

    it('When subtracting wraps from start of day', () => {
      const time = new PlainTimeImpl('00:00:00.000')
      const duration = new Duration(1, DurationUnit.MILLISECONDS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(23)
      expect(result.minutes()).toBe(59)
      expect(result.seconds()).toBe(59)
      expect(result.milliseconds()).toBe(999)
    })

    it('When subtracting from noon back to midnight', () => {
      const time = new PlainTimeImpl('12:00:00')
      const duration = new Duration(12, DurationUnit.HOURS)

      const result = time.subtract(duration)

      expect(result.hours()).toBe(0)
      expect(result.minutes()).toBe(0)
      expect(result.seconds()).toBe(0)
    })
  })
})
