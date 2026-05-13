import { Temporal } from 'temporal-polyfill'
import { useI18n } from 'vue-i18n'

import { useDateTimeConfig } from '#composables/config.composable.ts'
import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'
import type {
  DateTimeRangeInstant,
  DateTimeRangeInstantWithInfinity,
} from '#models/dateTimeRange.model.ts'
import type {
  PlainDate,
  PlainDateRange,
} from '#models/plainDate.model.ts'
import { DateUtil } from '#utils/date.util.ts'
import { TimeUtil } from '#utils/time.util.ts'

const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
} as const

export function useDateTimeFormat() {
  const i18n = useI18n()
  const {
    appLanguage,
    hourCycle,
    locale,
    timeZone,
  } = useDateTimeConfig()

  /**
   *
   */
  function formatPlainDate(date: PlainDate): string {
    return Temporal.PlainDate.from(date).toLocaleString(locale.value, DEFAULT_DATE_FORMAT_OPTIONS)
  }

  function formatPlainDateRange(range: PlainDateRange): string {
    const currentYear = Temporal.Now.plainDateISO().year
    const showYear = range.from?.year !== currentYear || range.until?.year !== currentYear

    function formatDate(date: PlainDate): string {
      const plainDateAsInstant = DateUtil.plainDateToInstant(date, timeZone.value)

      return toNamedDayAndMonth(plainDateAsInstant, showYear)
    }

    const start = range.from != null ? formatDate(range.from) : '…'
    const end = range.until != null ? formatDate(range.until) : '…'

    if (start === end) {
      return start
    }

    return `${start} - ${end}`
  }

  /**
   * Format an instant to a time string.
   * @param instant The instant to format.
   * @param withSeconds Whether to include seconds in the formatted time.
   * @returns The formatted time string.
   */
  function toTime(instant: DateTimeInstant, withSeconds = false): string {
    const formatter = new Intl.DateTimeFormat(
      locale.value,
      TimeUtil.getTimeFormatOptions(hourCycle.value, timeZone.value, withSeconds),
    )

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  /**
   * Format a DateTimeRangeInstantWithInfinity to a time range string.
   * E.g., "From 10:00", "Until 18:00", "10:00 - 18:00".
   * @param range The DateTimeRangeInstantWithInfinity to format.
   * @returns The formatted time range string.
   */
  function toTimeRange(
    range: DateTimeRangeInstantWithInfinity,
    showDayAndMonthForSameDayRanges = false,
  ): string {
    const start = range.from
    const end = range.until

    const today = DateUtil.getNow()
    const todayZdt = today.toZonedDateTimeISO(timeZone.value)
    const currentYear = todayZdt.year

    if (start === 'infinity' && end !== 'infinity') {
      const endZdt = end.toZonedDateTimeISO(timeZone.value)
      const isEndYearSameAsCurrentYear = endZdt.year === currentYear

      return i18n.t('date_time_format.until', {
        value: `${toNamedDayAndMonth(end)}${isEndYearSameAsCurrentYear ? '' : ` ${endZdt.year}`}, ${toTime(end)}`,
      })
    }

    if (start !== 'infinity' && end === 'infinity') {
      const startZdt = start.toZonedDateTimeISO(timeZone.value)
      const isStartYearSameAsCurrentYear = startZdt.year === currentYear

      return i18n.t('date_time_format.from', {
        value: `${toNamedDayAndMonth(start)}${isStartYearSameAsCurrentYear ? '' : ` ${startZdt.year}`}, ${toTime(start)}`,
      })
    }

    if (start === 'infinity' && end === 'infinity') {
      return '∞'
    }

    const startInstant = start as DateTimeInstant
    const endInstant = end as DateTimeInstant

    const startZdt = startInstant.toZonedDateTimeISO(timeZone.value)
    const endZdt = endInstant.toZonedDateTimeISO(timeZone.value)

    const isSameDay = startZdt.toPlainDate().equals(endZdt.toPlainDate())

    const isStartDateCurrentYear = startZdt.year === todayZdt.year
    const isEndDateCurrentYear = endZdt.year === todayZdt.year

    if (!isSameDay || showDayAndMonthForSameDayRanges) {
      return `${toNamedDayAndMonth(startInstant)}${isStartDateCurrentYear ? '' : ` ${startZdt.year}`}, ${toTime(startInstant)} - ${toNamedDayAndMonth(endInstant)}${isEndDateCurrentYear ? '' : ` ${endZdt.year}`}, ${toTime(endInstant)}`
    }

    return `${toTime(startInstant)} - ${toTime(endInstant)}`
  }

  /**
   * Format a DateTimeRangeInstant to a duration string.
   * E.g., "2 hours", "1 hour 30 minutes".
   * @param range The DateTimeRangeInstant to format.
   * @param format The format for the duration units (long, short, narrow).
   * @returns The formatted duration string.
   */
  function rangeToDuration(range: DateTimeRangeInstant, format: 'long' | 'narrow' | 'short' = 'long'): string {
    const durationInSeconds = Math.round(range.until.since(range.from).total('seconds'))
    const duration = Temporal.Duration
      .from({
        seconds: durationInSeconds,
      })
      .round({
        largestUnit: 'year',
        relativeTo: range.from.toZonedDateTimeISO(timeZone.value),
      })

    const {
      days,
      hours,
      minutes,
      months,
      seconds,
      years,
    } = duration

    function fmt(value: number, unit: Intl.NumberFormatOptions['unit'], unitDisplay = format): string {
      return new Intl.NumberFormat(appLanguage.value, {
        style: 'unit',
        unit,
        unitDisplay,
      }).format(value)
    }

    if (durationInSeconds < 60) {
      return fmt(seconds, 'second')
    }

    if (years === 0 && months === 0 && days === 0 && hours === 0) {
      return fmt(minutes, 'minute')
    }

    const parts: string[] = []

    if (years > 0) {
      parts.push(fmt(years, 'year', 'narrow'))
    }
    if (months > 0) {
      parts.push(fmt(months, 'month', 'narrow'))
    }
    if (days > 0) {
      parts.push(fmt(days, 'day', 'narrow'))
    }
    if (hours > 0 && years === 0) {
      parts.push(fmt(hours, 'hour', 'narrow'))
    }
    if (minutes > 0 && years === 0) {
      parts.push(fmt(minutes, 'minute', 'narrow'))
    }

    return parts.join(' ')
  }

  /**
   * Format an instant to a date string.
   * @param instant The instant to format.
   * @returns The formatted date string.
   */
  function toDate(instant: DateTimeInstant): string {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      ...DEFAULT_DATE_FORMAT_OPTIONS,
      timeZone: timeZone.value,
    })

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  /**
   * Format an instant to a date-time string.
   * @param instant The instant to format.
   * @param withSeconds Whether to include seconds in the formatted time.
   * @returns The formatted date-time string.
   */
  function toDateTime(instant: DateTimeInstant, withSeconds = false): string {
    const formatter = new Intl.DateTimeFormat(
      locale.value,
      {
        ...DEFAULT_DATE_FORMAT_OPTIONS,
        ...TimeUtil.getTimeFormatOptions(hourCycle.value, timeZone.value, withSeconds),
        timeZone: timeZone.value,
      },
    )

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  /**
   * Format an instant to a relative time string from now.
   * E.g., "in 5 minutes", "2 hours ago".
   * @param instant The target instant.
   * @param now The reference instant (default is now).
   * @returns The formatted relative time string.
   */
  function toRelativeTime(
    instant: DateTimeInstant,
    now = DateUtil.getNow(),
  ): string {
    const rtf = new Intl.RelativeTimeFormat(appLanguage.value, {
      numeric: 'auto',
      style: 'long',
    })

    const diffMs = instant.epochMilliseconds - now.epochMilliseconds

    const units: {
      ms: number
      unit: Intl.RelativeTimeFormatUnit
    }[] = [
      {
        ms: 1000 * 60 * 60 * 24 * 365,
        unit: 'year',
      },
      {
        ms: 1000 * 60 * 60 * 24 * 30,
        unit: 'month',
      },
      {
        ms: 1000 * 60 * 60 * 24 * 7,
        unit: 'week',
      },
      {
        ms: 1000 * 60 * 60 * 24,
        unit: 'day',
      },
      {
        ms: 1000 * 60 * 60,
        unit: 'hour',
      },
      {
        ms: 1000 * 60,
        unit: 'minute',
      },
      {
        ms: 1000,
        unit: 'second',
      },
    ]

    const isLessThanOneMinute = Math.abs(diffMs) < 60_000

    if (isLessThanOneMinute) {
      return i18n.t('date_time_format.now')
    }

    for (const {
      ms, unit,
    } of units) {
      const value = Math.round(diffMs / ms)

      if (Math.abs(value) >= 1) {
        return rtf.format(value, unit)
      }
    }

    return rtf.format(0, 'second')
  }

  /**
   * Format an instant to a day and month string.
   * @param instant The instant to format.
   * @returns The formatted day and month string.
   */
  function toDayAndMonth(instant: DateTimeInstant): string {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      day: '2-digit',
      month: '2-digit',
      timeZone: timeZone.value,
    })

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  /**
   * Format an instant to a named day and month string.
   * E.g., "Jan 1", "Feb 14".
   * @param instant The instant to format.
   * @returns The formatted named day and month string.
   */
  function toNamedDayAndMonth(instant: DateTimeInstant, year?: boolean): string {
    const formatter = new Intl.DateTimeFormat(appLanguage.value, {
      day: 'numeric',
      month: 'short',
      timeZone: timeZone.value,
      year: year === true ? 'numeric' : undefined,
    })

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  /**
   * Format an instant to a month and year string.
   * @param instant The instant to format.
   * @returns The formatted month and year string.
   */
  function toMonthAndYear(instant: DateTimeInstant): string {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      month: '2-digit',
      timeZone: timeZone.value,
      year: 'numeric',
    })

    const zonedDateTime = DateUtil.instantToZonedDateTime(instant, timeZone.value)

    return formatter.format(zonedDateTime.epochMilliseconds)
  }

  return {
    formatPlainDate,
    toDate,
    toDateTime,
    toRelativeTime,
    toTime,
    formatPlainDateRange,
    rangeToDuration,
    toDayAndMonth,
    toMonthAndYear,
    toNamedDayAndMonth,
    toTimeRange,
  }
}
