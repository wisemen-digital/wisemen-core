import { Temporal } from 'temporal-polyfill'

import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'
import type { DateTimeRangeInstant } from '#models/dateTimeRange.model.ts'
import type {
  PlainDate,
  PlainDateRange,
} from '#models/plainDate.model.ts'
import type { PlainTime } from '#models/plainTime.model.ts'
import type { TimeZone } from '#models/timeZone.model.ts'
import { TimeZoneUtil } from '#utils/timeZone.util.ts'

export class DateUtil {
  static earliest(...dates: DateTimeInstant[]): DateTimeInstant {
    return dates.reduce(
      (earliest, current) =>
        current.epochMilliseconds < earliest.epochMilliseconds ? current : earliest,
    )
  }

  static getNow(): DateTimeInstant {
    return Temporal.Now.instant()
  }

  static instantFrom(instantString: string): DateTimeInstant {
    return Temporal.Instant.from(instantString)
  }

  static instantFromDateAndTime(
    date: PlainDate,
    time: PlainTime,
    timeZone: TimeZone,
  ): Temporal.Instant {
    return date.toPlainDateTime(time).toZonedDateTime(timeZone).toInstant()
  }

  static instantToPlainDate(instant: DateTimeInstant, timeZone: TimeZone): PlainDate {
    return instant.toZonedDateTimeISO(timeZone).toPlainDate()
  }

  static instantToPlainTime(instant: DateTimeInstant, timeZone: TimeZone): PlainTime {
    return instant.toZonedDateTimeISO(timeZone).toPlainTime()
  }

  static instantToZonedDateTime(instant: DateTimeInstant, timeZone: TimeZone): Temporal.ZonedDateTime {
    return instant.toZonedDateTimeISO(timeZone)
  }

  static isAfter(dateA: DateTimeInstant, dateB: DateTimeInstant): boolean {
    return dateA.epochMilliseconds > dateB.epochMilliseconds
  }

  static isBefore(dateA: DateTimeInstant, dateB: DateTimeInstant): boolean {
    return dateA.epochMilliseconds < dateB.epochMilliseconds
  }

  static isEqual(dateA: DateTimeInstant, dateB: DateTimeInstant): boolean {
    return dateA.epochMilliseconds === dateB.epochMilliseconds
  }

  static latest(...dates: DateTimeInstant[]): DateTimeInstant {
    return dates.reduce(
      (latest, current) =>
        current.epochMilliseconds > latest.epochMilliseconds ? current : latest,
    )
  }

  static plainDateRangeToDateTimeInstantRange(range: PlainDateRange): DateTimeRangeInstant | null {
    if (range.from === null || range.until === null) {
      return null
    }

    return {
      from: range.from.toZonedDateTime({
        timeZone: TimeZoneUtil.getCurrentTimeZone(),
      }).toInstant(),
      until: range.until.toZonedDateTime({
        timeZone: TimeZoneUtil.getCurrentTimeZone(),
      }).with({
        hour: 23,
        millisecond: 59,
        minute: 59,
        second: 59,
      }).toInstant(),
    }
  }

  static plainDateTimeFromDateAndTime(date: PlainDate, time: PlainTime): Temporal.PlainDateTime {
    return Temporal.PlainDate.from(date).toPlainDateTime(Temporal.PlainTime.from(time))
  }

  static plainDateToInstant(date: PlainDate, timeZone: TimeZone): DateTimeInstant {
    return date.toZonedDateTime(timeZone).toInstant()
  }
}
