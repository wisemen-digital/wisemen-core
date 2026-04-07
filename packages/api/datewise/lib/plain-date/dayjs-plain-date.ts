import dayjs, { Dayjs } from 'dayjs'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { PlainTime, PlainTimeImpl } from '../plain-time/plain-time.js'
import { Timezone, TimezoneInput } from '../common/timezone.js'
import { Timestamp } from '../timestamp/timestamp.js'
import { Month } from '../common/month.js'
import { timestamp } from '../timestamp/index.js'
import { InvalidPlainDate } from './invalid-date.js'
import { PlainDateUnit, DiffPlainDateUnit, ReachablePlainDateUnit } from './plain-date.units.js'
import { PlainDateObject } from './plain-date-object.js'
import { PlainDate, PlainDateInput } from './plain-date.js'
import { factory } from './plain-date.factory.js'
import { plainDate } from './plain-date.fn.js'

export class DayjsPlainDate implements PlainDate {
  private date: dayjs.Dayjs

  /** Defaults to today */
  constructor ()
  /**
   *  Parse a date from a string
   *  @see https://day.js.org/docs/en/display/format
   */
  constructor (dateString: string, format?: string)
  constructor (dayjs: dayjs.Dayjs)
  constructor (date: Date)
  constructor (date: PlainDate)
  constructor (plainTimeObject: PlainDateObject)
  constructor (date: number)
  constructor (date: number | string)
  constructor (date: string | number | Date)
  constructor (date: PlainDateInput)
  constructor (input?: PlainDateInput, format?: string)
  constructor (input?: PlainDateInput, format: string = 'YYYY-MM-DD') {
    if (input === undefined) {
      this.date = dayjs()
    } else if (input instanceof DayjsPlainDate) {
      this.date = dayjs(input.date)
    } else if (input instanceof Date) {
      this.date = dayjs(input)
    } else if (dayjs.isDayjs(input)) {
      this.date = input.clone()
    } else if (typeof input === 'string') {
      this.date = dayjs(input, format, true)
    } else if (typeof input === 'number') {
      this.date = dayjs(input)
    } else if ('toDate' in input) {
      this.date = dayjs(input.toDate())
    } else {
      this.date = dayjs(`${input.year}-${input.month}-${input.day}`, 'YYYY-M-D', true)
    }

    if (!this.date.isValid()) {
      throw new InvalidPlainDate(this)
    }

    this.date = this.date.startOf('day')
  }

  isSame (otherDate: PlainDateInput, unit: PlainDateUnit = 'day'): boolean {
    const parsed = plainDate(otherDate)

    return parsed instanceof DayjsPlainDate && parsed.date.isSame(this.date, unit)
  }

  isAfter (otherDate: PlainDateInput, unit: PlainDateUnit = 'day'): boolean {
    const parsed = plainDate(otherDate)

    if (parsed.isFutureInfinity()) {
      return false
    } else if (parsed.isPastInfinity()) {
      return true
    } else if (parsed instanceof DayjsPlainDate) {
      return this.date.isAfter(parsed.date, unit)
    } else {
      return false
    }
  }

  isSameOrAfter (otherDate: PlainDateInput, unit: PlainDateUnit = 'day'): boolean {
    return this.isAfter(otherDate, unit) || this.isSame(otherDate, unit)
  }

  isBefore (otherDate: PlainDateInput, unit?: PlainDateUnit): boolean {
    const parsed = plainDate(otherDate)

    if (parsed.isPastInfinity()) {
      return false
    } else if (parsed.isFutureInfinity()) {
      return true
    } else if (parsed instanceof DayjsPlainDate) {
      return this.date.isBefore(parsed.date, unit)
    } else {
      return false
    }
  }

  isSameOrBefore (otherDate: PlainDateInput, unit: PlainDateUnit = 'day'): boolean {
    return this.isBefore(otherDate, unit) || this.isSame(otherDate, unit)
  }

  startOf (unit: ReachablePlainDateUnit): DayjsPlainDate {
    return new DayjsPlainDate(this.date.startOf(unit))
  }

  endOf (unit: ReachablePlainDateUnit): DayjsPlainDate {
    return new DayjsPlainDate(this.date.endOf(unit))
  }

  year (): number {
    return this.date.get('year')
  }

  month (): Month {
    return this.date.get('month') + 1
  }

  dayOfMonth (): number {
    return this.date.get('day')
  }

  weekOfYear (): number {
    return this.date.week()
  }

  dayOfYear (): number {
    return this.date.dayOfYear()
  }

  isToday (): boolean {
    return this.date.isToday()
  }

  isTomorrow (): boolean {
    return this.date.isTomorrow()
  }

  isYesterday (): boolean {
    return this.date.isYesterday()
  }

  add (amount: number, unit: PlainDateUnit): DayjsPlainDate {
    return new DayjsPlainDate(this.date.add(amount, unit))
  }

  subtract (amount: number, unit: PlainDateUnit): DayjsPlainDate {
    return new DayjsPlainDate(this.date.subtract(amount, unit))
  }

  until (otherDate: PlainDateInput): Duration {
    const parsed = factory(otherDate)

    if (parsed.isFutureInfinity()) {
      return new Duration(Infinity, DurationUnit.DAYS)
    } else if (parsed.isPastInfinity()) {
      return new Duration(-Infinity, DurationUnit.DAYS)
    } else {
      return new Duration(parsed.diff(this, 'days'), DurationUnit.DAYS)
    }
  }

  since (otherDate: PlainDateInput): Duration {
    const parsed = factory(otherDate)

    if (parsed.isFutureInfinity()) {
      return new Duration(-Infinity, DurationUnit.DAYS)
    } else if (parsed.isPastInfinity()) {
      return new Duration(Infinity, DurationUnit.DAYS)
    } else {
      return new Duration(this.diff(parsed, 'days'), DurationUnit.DAYS)
    }
  }

  diff (withOther: PlainDateInput, unit: DiffPlainDateUnit, precise = false): number {
    const parsed = factory(withOther)

    if (parsed.isFutureInfinity() || parsed.isPastInfinity()) {
      return Infinity
    } else if (parsed instanceof DayjsPlainDate) {
      return this.date.diff(parsed.date, unit, precise)
    } else {
      return 0 // should be unreachable
    }
  }

  format (template: string): string {
    return this.date.format(template)
  }

  clone (): DayjsPlainDate {
    return new DayjsPlainDate(this.date)
  }

  toPlainObject (): PlainDateObject {
    return {
      year: this.year(),
      month: this.month(),
      day: this.dayOfMonth()
    }
  }

  toDate (withTime?: PlainTime, timezone?: Timezone): Date {
    return this.combine(withTime, timezone).toDate()
  }

  toString (): string {
    return this.format('YYYY-MM-DD')
  }

  toJSON (): string {
    return this.toString()
  }

  toTimestamp (withTime?: PlainTime, timezone?: TimezoneInput): Timestamp {
    return timestamp(this.combine(withTime, timezone))
  }

  isFutureInfinity (): boolean {
    return false
  }

  isPastInfinity (): boolean {
    return false
  }

  day (): number {
    return this.date.day()
  }

  isInfinity (): boolean {
    return this.isFutureInfinity() || this.isPastInfinity()
  }

  valueOf (): string {
    return this.toString()
  }

  private combine (
    withTime: PlainTimeImpl | undefined,
    timezone: TimezoneInput | undefined
  ): Dayjs {
    const timeString = `${this.toString()} ${withTime?.format('hh:mm:ss.SSS') ?? '00:00:00.000'}`

    if (timezone !== undefined) {
      return dayjs.tz(timeString, 'YYYY-MM-DD HH:mm:ss.SSS', timezone)
    } else {
      return dayjs(timeString)
    }
  }
}
