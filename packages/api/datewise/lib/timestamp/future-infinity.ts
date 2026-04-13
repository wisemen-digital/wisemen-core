import { OpUnitType } from 'dayjs'
import { Duration, DurationUnit } from '@wisemen/quantity'
import { PlainDate } from '../plain-date/plain-date.js'
import { plainDate } from '../plain-date/index.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { plainTime } from '../plain-time/plain-time-entry.js'
import { Month } from '../common/month.js'
import { TimezoneInput } from '../common/timezone.js'
import { ILocale, Timestamp, TimestampInput } from './timestamp.js'
import { factory } from './timestamp.factory.js'

export class FutureInfinity implements Timestamp {
  clone (): this {
    return this
  }

  isPastInfinity (): boolean {
    return false
  }

  isFutureInfinity (): boolean {
    return true
  }

  isInfinity (): boolean {
    return true
  }

  isValid (): boolean {
    return true
  }

  year (): number | Timestamp {
    throw new Error('cannot access year on future infinity')
  }

  month (): Month | Timestamp {
    throw new Error('cannot access month on future infinity')
  }

  date (): number | Timestamp {
    throw new Error('cannot access date on future infinity')
  }

  day (): number | Timestamp {
    throw new Error('cannot access day on future infinity')
  }

  hour (): number | Timestamp {
    throw new Error('cannot access hour on future infinity')
  }

  minute (): number | Timestamp {
    throw new Error('cannot access minute on future infinity')
  }

  second (): number | Timestamp {
    throw new Error('cannot access second on future infinity')
  }

  millisecond (): number | Timestamp {
    throw new Error('cannot access millisecond on future infinity')
  }

  set (): this {
    return this
  }

  get (unit: OpUnitType): number {
    throw new Error(`cannot access ${unit} on future infinity`)
  }

  add (): this {
    return this
  }

  addDuration (): this {
    return this
  }

  subtract (): this {
    return this
  }

  subtractDuration (): this {
    return this
  }

  startOf (): this {
    return this
  }

  endOf (): this {
    return this
  }

  format (): 'infinity' {
    return 'infinity'
  }

  diff (): number {
    return Infinity
  }

  getTime (): number {
    return Infinity
  }

  valueOf (): number {
    return Infinity
  }

  unix (): number {
    return Infinity
  }

  daysInMonth (): number {
    throw new Error(`cannot access days in month on future infinity`)
  }

  toDate (): Date {
    throw new Error(`cannot convert future infinity to Date`)
  }

  toJSON (): '"infinity"' {
    return '"infinity"'
  }

  toISOString (): 'infinity' {
    return 'infinity'
  }

  toString (): 'infinity' {
    return 'infinity'
  }

  toPlainDate (): PlainDate {
    return plainDate(this)
  }

  toPlainTime (): PlainTime {
    return plainTime({ hours: 24, minutes: 0, seconds: 0, milliseconds: 0 })
  }

  utcOffset (): number {
    return Infinity
  }

  isBefore (): boolean {
    return false
  }

  isAfter (other: TimestampInput): boolean {
    other = factory(other)

    return !other.isFutureInfinity()
  }

  isSame (other: TimestampInput): boolean {
    other = factory(other)

    return other instanceof FutureInfinity
  }

  isSameOrAfter (other: TimestampInput): boolean {
    return this.isAfter(other) || this.isSame(other)
  }

  isSameOrBefore (other: TimestampInput): boolean {
    return this.isSame(other)
  }

  until (otherTimestamp: TimestampInput): Duration {
    if (this.isSame(otherTimestamp)) {
      return new Duration(0, DurationUnit.MILLISECONDS)
    } else {
      return new Duration(-Infinity, DurationUnit.MILLISECONDS)
    }
  }

  since (otherTimestamp: TimestampInput): Duration {
    if (this.isSame(otherTimestamp)) {
      return new Duration(0, DurationUnit.MILLISECONDS)
    } else {
      return new Duration(Infinity, DurationUnit.MILLISECONDS)
    }
  }

  locale (): string
  locale (preset: string | ILocale, object?: Partial<ILocale>): this
  locale (preset?: string | ILocale, _object?: Partial<ILocale>): this | string {
    if (preset === undefined) {
      return 'infinity'
    }

    return this
  }

  setTimezone (_timezone: TimezoneInput): Timestamp {
    return this
  }
}
