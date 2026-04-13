import {
  CalendarDate,
  getLocalTimeZone,
} from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { Temporal } from 'temporal-polyfill'

function plainDateToDate(plainDate: Temporal.PlainDate): Date {
  return new Date(plainDate.toString())
}

export function dateToDateValue(date: Date): DateValue {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) as unknown as DateValue
}

export function dateValueToPlainDate(value: DateValue): Temporal.PlainDate {
  const date = value.toDate(getLocalTimeZone())

  return new Temporal.PlainDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function plainDateToDateValue(plainDate: Temporal.PlainDate): DateValue {
  return dateToDateValue(plainDateToDate(plainDate))
}

export function dateValueToDate(value: DateValue): Date {
  return value.toDate(getLocalTimeZone())
}

// 0-based
export function getMonthName(month: number, locale: string, format: 'long' | 'short'): string {
  return new Intl.DateTimeFormat(locale, {
    month: format,
  }).format(new Date(1, month))
}

// 0-based
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

export function getFirstDayOfWeek(locale: string): 0 | 1 {
  // List of locales where the first day of the week is Sunday
  const sundayFirstLocales = [
    'en-US',
    'en-CA',
    'en-PH',
    'en-MY',
    'en-AU',
    'en-NZ',
    'en-IN',
    'ja-JP',
    'zh-CN',
  ] as const

  // Normalize locale (remove region, lowercase)

  // Check if locale is in the Sunday-first list
  if (sundayFirstLocales.some((l) => l.toLowerCase() === locale.toLowerCase())) {
    return 0 // Sunday
  }

  return 1 // Default to Monday
}

export function getWeekdayLabels(calendarLocale: string, labelLocale: string, format: 'long' | 'short' = 'short'): string[] {
  const firstDay = getFirstDayOfWeek(calendarLocale)

  // Create a base Sunday (0 Jan 2023) and map indices
  const baseDate = new Date(Date.UTC(2023, 0, 1)) // Sunday
  const weekdays: string[] = []

  const dtf = new Intl.DateTimeFormat(labelLocale, {
    weekday: format,
  })

  for (let i = 0; i < 7; i++) {
    const dayIndex = (firstDay + i) % 7
    const date = new Date(baseDate)

    date.setUTCDate(baseDate.getUTCDate() + dayIndex)
    weekdays.push(dtf.format(date))
  }

  return weekdays
}
