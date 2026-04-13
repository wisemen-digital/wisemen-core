import dayjs, { ManipulateType, OptionType, OpUnitType, UnitType } from 'dayjs'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { PlainDate } from '../plain-date/plain-date.js'
import { plainDate } from '../plain-date/index.js'
import { PlainTime, PlainTimeImpl } from '../plain-time/plain-time.js'
import { Month } from '../common/month.js'
import { plainTime } from '../plain-time/plain-time-entry.js'
import { DayjsPlainDate } from '../plain-date/dayjs-plain-date.js'
import { TimezoneInput } from '../common/timezone.js'
import { factory } from './timestamp.factory.js'
import { ILocale, Timestamp, TimestampInput } from './timestamp.js'

export class DayjsTimestamp implements Timestamp {
  private value: dayjs.Dayjs

  constructor (
    date?: dayjs.ConfigType | Timestamp | PlainDate,
    formatOrTime?: OptionType | PlainTime,
    localeOrTimezone?: TimezoneInput
  ) {
    if (typeof date === 'object' && date !== null && 'isInfinity' in date && date.isInfinity()) {
      throw new Error('cannot create dayjs timestamp from infinity')
    }

    if (date instanceof DayjsPlainDate && formatOrTime instanceof PlainTimeImpl) {
      this.value = dayjs.tz(
        `${date.toString()} ${formatOrTime?.format('hh:mm:ss.SSS') ?? '00:00:00.000'}`,
        'YYYY-MM-DD HH:mm:ss.SSS',
        localeOrTimezone as string
      )
    } else {
      this.value = dayjs(date?.valueOf(), formatOrTime as OptionType, localeOrTimezone, true)
    }
  }

  clone (): DayjsTimestamp {
    return new DayjsTimestamp(this.value.clone())
  }

  isPastInfinity (): boolean {
    return false
  }

  isFutureInfinity (): boolean {
    return false
  }

  isInfinity (): boolean {
    return this.isFutureInfinity() || this.isPastInfinity()
  }

  isValid (): boolean {
    return this.value.isValid()
  }

  year (): number
  year (value: number): DayjsTimestamp
  year (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.year()
    } else {
      return new DayjsTimestamp(this.value.year(value))
    }
  }

  month (): Month
  month (value: Month): DayjsTimestamp
  month (value?: Month): Month | DayjsTimestamp {
    if (value === undefined) {
      return this.value.month() + 1
    } else {
      return new DayjsTimestamp(this.value.month(value - 1))
    }
  }

  date (): number
  date (value: number): DayjsTimestamp
  date (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.date()
    } else {
      return new DayjsTimestamp(this.value.date(value))
    }
  }

  day (): number
  day (value: number): DayjsTimestamp
  day (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.day()
    } else {
      return new DayjsTimestamp(this.value.day(value))
    }
  }

  hour (): number
  hour (value: number): DayjsTimestamp
  hour (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.hour()
    } else {
      return new DayjsTimestamp(this.value.hour(value))
    }
  }

  minute (): number
  minute (value: number): DayjsTimestamp
  minute (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.minute()
    } else {
      return new DayjsTimestamp(this.value.minute(value))
    }
  }

  second (): number
  second (value: number): DayjsTimestamp
  second (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.second()
    } else {
      return new DayjsTimestamp(this.value.second(value))
    }
  }

  millisecond (): number
  millisecond (value: number): DayjsTimestamp
  millisecond (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.millisecond()
    } else {
      return new DayjsTimestamp(this.value.millisecond(value))
    }
  }

  set (unit: UnitType, value: number): DayjsTimestamp {
    return new DayjsTimestamp(this.value.set(unit, value))
  }

  get (unit: UnitType): number {
    return this.value.get(unit)
  }

  getTime (): number {
    return this.value.valueOf()
  }

  add (value: number, unit?: ManipulateType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.add(value, unit))
  }

  addDuration (duration: Duration): Timestamp {
    return new DayjsTimestamp(this.value.add(duration.milliseconds, 'ms'))
  }

  subtract (value: number, unit?: ManipulateType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.subtract(value, unit))
  }

  subtractDuration (duration: Duration): Timestamp {
    return new DayjsTimestamp(this.value.subtract(duration.milliseconds, 'ms'))
  }

  startOf (unit: OpUnitType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.startOf(unit))
  }

  endOf (unit: OpUnitType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.endOf(unit))
  }

  format (template?: string): string {
    return this.value.format(template)
  }

  diff (withOther: TimestampInput, unit: OpUnitType, precise = false): number {
    withOther = factory(withOther)

    if (withOther.isFutureInfinity() || withOther.isPastInfinity()) {
      return Infinity
    }

    return this.value.diff((withOther as DayjsTimestamp).value, unit, precise)
  }

  valueOf (): number {
    return this.value.valueOf()
  }

  unix (): number {
    return this.value.unix()
  }

  daysInMonth (): number {
    return this.value.daysInMonth()
  }

  toDate (): Date {
    return this.value.toDate()
  }

  toJSON (): string {
    return this.value.toJSON()
  }

  toISOString (): string {
    return this.value.toISOString()
  }

  toString (): string {
    return this.value.toString()
  }

  toPlainDate (): PlainDate {
    return plainDate(this)
  }

  toPlainTime (): PlainTime {
    return plainTime(this.value.format('HH:mm:ss.SSS'))
  }

  utcOffset (): number {
    return this.value.utcOffset()
  }

  isBefore (other: TimestampInput, unit?: OpUnitType): boolean {
    other = factory(other)

    if (other.isPastInfinity()) {
      return false
    } else if (other.isFutureInfinity()) {
      return true
    }

    return this.value.isBefore((other as DayjsTimestamp).value, unit)
  }

  isAfter (other: TimestampInput, unit?: OpUnitType): boolean {
    other = factory(other)

    if (other.isFutureInfinity()) {
      return false
    } else if (other.isPastInfinity()) {
      return true
    }

    return this.value.isAfter((other as DayjsTimestamp).value, unit)
  }

  isSame (other: TimestampInput, unit?: OpUnitType): boolean {
    other = factory(other)

    if (other.isInfinity()) {
      return false
    }

    return this.value.isSame((other as DayjsTimestamp).value, unit)
  }

  isSameOrAfter (other: TimestampInput, unit?: OpUnitType): boolean {
    return this.isAfter(other, unit) || this.isSame(other, unit)
  }

  isSameOrBefore (other: TimestampInput, unit?: OpUnitType): boolean {
    return this.isBefore(other, unit) || this.isSame(other, unit)
  }

  locale (): string
  locale (preset: string | ILocale, object?: Partial<ILocale>): DayjsTimestamp
  locale (preset?: string | ILocale, object?: Partial<ILocale>): DayjsTimestamp | string {
    if (preset === undefined) {
      return this.value.locale()
    }

    return new DayjsTimestamp(this.value.locale(preset, object))
  }

  until (otherTimestamp: TimestampInput): Duration {
    const parsed = factory(otherTimestamp)

    if (parsed.isFutureInfinity()) {
      return new Duration(Infinity, DurationUnit.MILLISECONDS)
    } else if (parsed.isPastInfinity()) {
      return new Duration(-Infinity, DurationUnit.MILLISECONDS)
    } else {
      return new Duration(parsed.diff(this, 'milliseconds'), DurationUnit.MILLISECONDS)
    }
  }

  since (otherTimestamp: TimestampInput): Duration {
    const parsed = factory(otherTimestamp)

    if (parsed.isFutureInfinity()) {
      return new Duration(-Infinity, DurationUnit.MILLISECONDS)
    } else if (parsed.isPastInfinity()) {
      return new Duration(Infinity, DurationUnit.MILLISECONDS)
    } else {
      return new Duration(this.diff(parsed, 'milliseconds'), DurationUnit.MILLISECONDS)
    }
  }

  setTimezone (timezone: TimezoneInput): DayjsTimestamp {
    const change = new DayjsTimestamp(this.value)

    change.value = change.value.tz(timezone)

    return change
  }
}
