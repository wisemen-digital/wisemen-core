import dayjs, { ManipulateType, OpUnitType, UnitType } from 'dayjs'
import { timestamp } from './timestamp.factory.js'
import { ILocale, Timestamp, TimestampInput } from './timestamp.js'

export class DayjsTimestamp implements Timestamp {
  private value: dayjs.Dayjs

  constructor (
    date?: dayjs.ConfigType | Timestamp,
    format?: dayjs.OptionType,
    locale?: string,
    strict?: boolean
  ) {
    if (typeof date === 'object' && date !== null && 'isInfinity' in date && date.isInfinity()) {
      throw new Error('cannot create dayjs timestamp from infinity')
    }

    this.value = dayjs(date?.valueOf(), format, locale, strict)
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

  month (): number
  month (value: number): DayjsTimestamp
  month (value?: number): number | DayjsTimestamp {
    if (value === undefined) {
      return this.value.month()
    } else {
      return new DayjsTimestamp(this.value.month(value))
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

  add (value: number, unit?: ManipulateType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.add(value, unit))
  }

  subtract (value: number, unit?: ManipulateType): DayjsTimestamp {
    return new DayjsTimestamp(this.value.subtract(value, unit))
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
    withOther = timestamp(withOther)

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

  utcOffset (): number {
    return this.value.utcOffset()
  }

  isBefore (other: TimestampInput, unit: OpUnitType = 'milliseconds'): boolean {
    other = timestamp(other)

    if (other.isPastInfinity()) {
      return false
    } else if (other.isFutureInfinity()) {
      return true
    }

    return this.value.isBefore((other as DayjsTimestamp).value, unit)
  }

  isAfter (other: TimestampInput, unit: OpUnitType = 'milliseconds'): boolean {
    other = timestamp(other)

    if (other.isFutureInfinity()) {
      return false
    } else if (other.isPastInfinity()) {
      return true
    }

    return this.value.isAfter((other as DayjsTimestamp).value, unit)
  }

  isSame (other: TimestampInput, unit: OpUnitType = 'milliseconds'): boolean {
    other = timestamp(other)

    if (other.isInfinity()) {
      return false
    }

    return this.value.isSame((other as DayjsTimestamp).value, unit)
  }

  isSameOrAfter (other: TimestampInput, unit: OpUnitType = 'milliseconds'): boolean {
    return this.isAfter(other, unit) || this.isSame(other, unit)
  }

  isSameOrBefore (other: TimestampInput, unit: OpUnitType = 'milliseconds'): boolean {
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
}
