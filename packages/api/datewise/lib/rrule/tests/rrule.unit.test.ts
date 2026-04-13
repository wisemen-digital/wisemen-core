import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { initDayjs } from '../../common/init-dayjs.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { Timestamp, timestamp } from '../../timestamp/index.js'
import { RRuleFrequency } from '../frequency.js'
import { RRuleImpl } from '../rrule.js'
import { TimezoneInput } from '../../common/timezone.js'
import { plainDate } from '../../plain-date/index.js'
import { plainTime } from '../../plain-time/plain-time-entry.js'

describe('RRule unit tests', () => {
  before(() => {
    initDayjs()
  })

  function makeRRule ({
    range = new DateTimeRange(-Infinity, Infinity),
    tz: timezone = 'UTC' as TimezoneInput,
    startDate = plainDate(),
    startTime = plainTime(0),
    duration = new Duration(1, DurationUnit.HOURS),
    frequency = RRuleFrequency.DAILY,
    interval = 1,
    exceptions = [] as Timestamp[]
  }) {
    return RRuleImpl.create(
      range,
      timezone,
      startDate,
      startTime,
      duration,
      frequency,
      interval,
      exceptions
    )
  }

  describe('occurrences', () => {
    it('generates a single occurrence when interval is zero and the occurrence is not in exceptions', () => {
      const startDate = plainDate('2024-05-05')
      const startTime = plainTime('10:00:00')
      const start = timestamp('2024-05-05')
      const end = timestamp('2024-05-06')
      const range = new DateTimeRange(start, end)
      const duration = new Duration(8, DurationUnit.HOURS)
      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        duration,
        tz: 'Europe/Brussels',
        interval: 0
      })
      const occurrences = Array.from(rrule.occurrences())

      expect(occurrences).toHaveLength(1)

      const expectedStart = timestamp(startDate, startTime, 'Europe/Brussels')
      const expectedOccurrence = new DateTimeRange(
        expectedStart,
        expectedStart.addDuration(duration),
        '[)'
      )

      expect(occurrences[0].isSame(expectedOccurrence)).toBe(true)
    })

    it('does not generate an occurrence when interval is zero and occurrence is in exceptions', () => {
      const startDate = plainDate('2024-05-05')
      const startTime = plainTime('10:00:00')
      const start = timestamp(startDate, startTime, 'Europe/Brussels')
      const duration = new Duration(6, DurationUnit.HOURS)
      const end = start.addDuration(duration)

      const range = new DateTimeRange(start, end, '[)')

      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        duration,
        tz: 'Europe/Brussels',
        interval: 0,
        exceptions: [start]
      })
      const occurrences = Array.from(rrule.occurrences())

      expect(occurrences).toHaveLength(0)
    })

    it('generates daily occurrences for a range', () => {
      const startDate = plainDate('2024-06-01')
      const startTime = plainTime('10:00:00')
      const start = timestamp(startDate, startTime, 'Europe/Brussels')

      const endDate = plainDate('2024-06-03')
      const endTime = plainTime('14:00:00')
      const end = timestamp(endDate, endTime, 'Europe/Brussels')

      const range = new DateTimeRange(start, end, '[)')
      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        tz: 'Europe/Brussels',
        duration: new Duration(4, DurationUnit.HOURS),
        frequency: RRuleFrequency.DAILY,
        interval: 1
      })
      const occurrences = Array.from(rrule.occurrences())

      const expectedOccurrences = [
        new DateTimeRange('2024-06-01T10:00:00+02:00', '2024-06-01T14:00:00+02:00', '[)'),
        new DateTimeRange('2024-06-02T10:00:00+02:00', '2024-06-02T14:00:00+02:00', '[)'),
        new DateTimeRange('2024-06-03T10:00:00+02:00', '2024-06-03T14:00:00+02:00', '[)')
      ]

      expect(occurrences).toHaveLength(3)

      for (let i = 0; i < expectedOccurrences.length; i++) {
        expect(occurrences[i].isSame(expectedOccurrences[i])).toBe(true)
      }
    })

    it('generates subset of a range where the subset is at the start of the range', () => {
      const startDate = plainDate('2024-06-01')
      const startTime = plainTime('10:00:00')
      const start = timestamp(startDate, startTime, 'Europe/Brussels')

      const endDate = plainDate('2024-06-03')
      const endTime = plainTime('14:00:00')
      const end = timestamp(endDate, endTime, 'Europe/Brussels')

      const range = new DateTimeRange(start, end, '[)')
      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        tz: 'Europe/Brussels',
        duration: new Duration(4, DurationUnit.HOURS),
        frequency: RRuleFrequency.DAILY,
        interval: 1
      })
      const occurrences = Array.from(rrule.occurrences(
        new DateTimeRange(start.add(1, 'day'), end, '[)')
      ))

      const expectedOccurrences = [
        new DateTimeRange('2024-06-02T10:00:00+02:00', '2024-06-02T14:00:00+02:00', '[)'),
        new DateTimeRange('2024-06-03T10:00:00+02:00', '2024-06-03T14:00:00+02:00', '[)')
      ]

      expect(occurrences).toHaveLength(2)

      for (let i = 0; i < expectedOccurrences.length; i++) {
        expect(occurrences[i].isSame(expectedOccurrences[i])).toBe(true)
      }
    })

    it('generates subset of a range where the subset is in the middle of the range', () => {
      const startDate = plainDate('2024-06-01')
      const startTime = plainTime('10:00:00')
      const start = timestamp(startDate, startTime, 'Europe/Brussels')

      const endDate = plainDate('2024-06-03')
      const endTime = plainTime('14:00:00')
      const end = timestamp(endDate, endTime, 'Europe/Brussels')

      const range = new DateTimeRange(start, end, '[)')
      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        tz: 'Europe/Brussels',
        duration: new Duration(4, DurationUnit.HOURS),
        frequency: RRuleFrequency.DAILY,
        interval: 1
      })
      const occurrences = Array.from(rrule.occurrences(
        new DateTimeRange(start.add(1, 'day'), end.subtract(1, 'day'), '[)')
      ))

      const expectedOccurrences = [
        new DateTimeRange('2024-06-02T10:00:00+02:00', '2024-06-02T14:00:00+02:00', '[)')
      ]

      expect(occurrences).toHaveLength(1)

      for (let i = 0; i < expectedOccurrences.length; i++) {
        expect(occurrences[i].isSame(expectedOccurrences[i])).toBe(true)
      }
    })

    it('generates weekly occurrences when frequency is weekly, interval 1', () => {
      const startDate = plainDate('2024-01-01')
      const start = timestamp(startDate, plainTime(0), 'UTC')
      const range = new DateTimeRange(start, start.add(29, 'days')) // Jan 1 to Jan 29
      const rrule = makeRRule({
        range,
        startDate,
        startTime: start.toPlainTime(),
        frequency: RRuleFrequency.WEEKLY,
        interval: 1
      })
      const occurrences = Array.from(rrule.occurrences())

      expect(occurrences).toHaveLength(5)
      expect(occurrences[0].from.isSame(start)).toBe(true)
      expect(occurrences[1].from.isSame(start.add(7, 'days'))).toBe(true)
      expect(occurrences[2].from.isSame(start.add(14, 'days'))).toBe(true)
      expect(occurrences[3].from.isSame(start.add(21, 'days'))).toBe(true)
      expect(occurrences[4].from.isSame(start.add(28, 'days'))).toBe(true)
    })

    it('generates daily occurrences for a range, except for excepted start timestamps', () => {
      const startDate = plainDate('2024-06-01')
      const startTime = plainTime('10:00:00')
      const start = timestamp(startDate, startTime, 'Europe/Brussels')

      const endDate = plainDate('2024-06-03')
      const endTime = plainTime('14:00:00')
      const end = timestamp(endDate, endTime, 'Europe/Brussels')

      const range = new DateTimeRange(start, end, '[)')
      const rrule = makeRRule({
        range,
        startDate,
        startTime,
        tz: 'Europe/Brussels',
        duration: new Duration(4, DurationUnit.HOURS),
        frequency: RRuleFrequency.DAILY,
        interval: 1,
        exceptions: [timestamp('2024-06-02T10:00:00+02:00')]
      })
      const occurrences = Array.from(rrule.occurrences())

      const expectedOccurrences = [
        new DateTimeRange('2024-06-01T10:00:00+02:00', '2024-06-01T14:00:00+02:00', '[)'),
        new DateTimeRange('2024-06-03T10:00:00+02:00', '2024-06-03T14:00:00+02:00', '[)')
      ]

      expect(occurrences).toHaveLength(2)

      for (let i = 0; i < expectedOccurrences.length; i++) {
        expect(occurrences[i].isSame(expectedOccurrences[i])).toBe(true)
      }
    })

    it('does not yield anything if the search range does not overlap', () => {
      const startDate = plainDate('2025-01-01')
      const start = timestamp('2025-01-01')
      const end = timestamp('2025-01-10')
      const range = new DateTimeRange(start, end)
      const rrule = makeRRule({
        range,
        startDate
      })
      const searchRange = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-10'))
      const occurrences = Array.from(rrule.occurrences(searchRange))

      expect(occurrences).toHaveLength(0)
    })
  })
})
