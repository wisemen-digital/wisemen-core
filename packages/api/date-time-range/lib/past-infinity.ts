import { OpUnitType } from 'dayjs'
import { timestamp } from './timestamp.factory.js'
import { ILocale, Timestamp, TimestampInput } from './timestamp.js'

export class PastInfinity implements Timestamp {
  clone (): this {
    return this
  }

  isPastInfinity (): boolean {
    return true
  }

  isFutureInfinity (): boolean {
    return false
  }

  isInfinity (): boolean {
    return true
  }

  isValid (): boolean {
    return true
  }

  year (): number | Timestamp {
    throw new Error('cannot access year on past infinity')
  }

  month (): number | Timestamp {
    throw new Error('cannot access month on past infinity')
  }

  date (): number | Timestamp {
    throw new Error('cannot access date on past infinity')
  }

  day (): number | Timestamp {
    throw new Error('cannot access day on past infinity')
  }

  hour (): number | Timestamp {
    throw new Error('cannot access hour on past infinity')
  }

  minute (): number | Timestamp {
    throw new Error('cannot access minute on past infinity')
  }

  second (): number | Timestamp {
    throw new Error('cannot access second on past infinity')
  }

  millisecond (): number | Timestamp {
    throw new Error('cannot access millisecond on past infinity')
  }

  set (): this {
    return this
  }

  get (unit: OpUnitType): number {
    throw new Error(`cannot access ${unit} on past infinity`)
  }

  add (): this {
    return this
  }

  subtract (): this {
    return this
  }

  startOf (): this {
    return this
  }

  endOf (): this {
    return this
  }

  format (): '-infinity' {
    return '-infinity'
  }

  diff (): number {
    return Infinity
  }

  valueOf (): number {
    return -Infinity
  }

  unix (): number {
    return -Infinity
  }

  daysInMonth (): number {
    throw new Error(`cannot access days in month on past infinity`)
  }

  toDate (): Date {
    throw new Error(`cannot convert past infinity to Date`)
  }

  toJSON (): '"-infinity"' {
    return '"-infinity"'
  }

  toISOString (): '-infinity' {
    return '-infinity'
  }

  toString (): '-infinity' {
    return '-infinity'
  }

  utcOffset (): number {
    return -Infinity
  }

  isBefore (other: TimestampInput): boolean {
    other = timestamp(other)

    return !other.isPastInfinity()
  }

  isAfter (): boolean {
    return false
  }

  isSame (other: TimestampInput): boolean {
    other = timestamp(other)

    return other instanceof PastInfinity
  }

  isSameOrAfter (other: TimestampInput): boolean {
    return this.isSame(other)
  }

  isSameOrBefore (other: TimestampInput): boolean {
    return this.isBefore(other) || this.isSame(other)
  }

  locale (): string
  locale (preset: string | ILocale, object?: Partial<ILocale>): this
  locale (preset?: string | ILocale, _object?: Partial<ILocale>): this | string {
    if (preset === undefined) {
      return '-infinity'
    }

    return this
  }
}
