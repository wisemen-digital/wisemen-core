import { OpUnitType } from 'dayjs'
import { ILocale, Timestamp, TimestampInput } from './timestamp.js'
import { timestamp } from './timestamp.factory.js'

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

  month (): number | Timestamp {
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

  subtract (): this {
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

  utcOffset (): number {
    return Infinity
  }

  isBefore (): boolean {
    return false
  }

  isAfter (other: TimestampInput): boolean {
    other = timestamp(other)

    return !other.isFutureInfinity()
  }

  isSame (other: TimestampInput): boolean {
    other = timestamp(other)

    return other instanceof FutureInfinity
  }

  isSameOrAfter (other: TimestampInput): boolean {
    return this.isAfter(other) || this.isSame(other)
  }

  isSameOrBefore (other: TimestampInput): boolean {
    return this.isSame(other)
  }

  locale (): string
  locale (preset: string | ILocale, object?: Partial<ILocale>): this
  locale (preset?: string | ILocale, _object?: Partial<ILocale>): this | string {
    if (preset === undefined) {
      return 'infinity'
    }

    return this
  }
}
