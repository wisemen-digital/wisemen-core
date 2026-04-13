import { UnitType, ManipulateType, OpUnitType, Dayjs } from 'dayjs'
import { Duration } from '@wisemen/quantity'
import { PlainDate } from '../plain-date/plain-date.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { Month } from '../common/month.js'
import { TimezoneInput } from '../common/timezone.js'

export interface ILocale {
  name: string
  weekdays?: string[]
  months?: string[]
  weekStart?: number
  weekdaysShort?: string[]
  monthsShort?: string[]
  weekdaysMin?: string[]
  ordinal?: (n: number) => number | string
  formats: Partial<{
    LT: string
    LTS: string
    L: string
    LL: string
    LLL: string
    LLLL: string
  }>
  relativeTime: Partial<{
    future: string
    past: string
    s: string
    m: string
    mm: string
    h: string
    hh: string
    d: string
    dd: string
    M: string
    MM: string
    y: string
    yy: string
  }>
}

export type TimestampInput
  = Timestamp | string | Date | null | undefined | number | PlainDate | Dayjs

export interface Timestamp {
  clone(): Timestamp
  isPastInfinity(): boolean
  isFutureInfinity(): boolean
  isInfinity(): boolean
  isValid(): boolean
  year(value?: number): number | Timestamp
  month(value?: Month): Month | Timestamp
  date(value?: number): number | Timestamp
  day(value?: number): number | Timestamp
  hour(value?: number): number | Timestamp
  minute(value?: number): number | Timestamp
  second(value?: number): number | Timestamp
  millisecond(value?: number): number | Timestamp
  set(unit: UnitType, value: number): Timestamp
  get(unit: UnitType): number
  add(value: number, unit?: ManipulateType): Timestamp
  addDuration(duration: Duration): Timestamp
  subtract(value: number, unit?: ManipulateType): Timestamp
  subtractDuration(duration: Duration): Timestamp
  startOf(unit: OpUnitType): Timestamp
  endOf(unit: OpUnitType): Timestamp
  format(template?: string): string
  diff(withOther: TimestampInput, unit: OpUnitType, precise?: boolean): number
  /** returns the number of milliseconds since the Unix Epoch */
  getTime(): number
  /** returns the number of milliseconds since the Unix Epoch */
  valueOf(): number
  /** returns the number of seconds since the Unix Epoch */
  unix(): number
  daysInMonth(): number
  toDate(): Date
  toJSON(): string
  toISOString(): string
  toString(): string
  utcOffset(): number
  isBefore(other: TimestampInput, unit?: OpUnitType): boolean
  isAfter(other: TimestampInput, unit?: OpUnitType): boolean
  isSame(other: TimestampInput, unit?: OpUnitType): boolean
  isSameOrAfter(other: TimestampInput, unit?: OpUnitType): boolean
  isSameOrBefore(other: TimestampInput, unit?: OpUnitType): boolean
  locale(preset?: string | ILocale, object?: Partial<ILocale>): Timestamp | string
  /** returns with a plain date based on the current timezone of the timestamp */
  toPlainDate(): PlainDate
  /** returns with a plain time based on the current timezone of the timestamp */
  toPlainTime(): PlainTime
  setTimezone(timezone: TimezoneInput): Timestamp
  /**
   * Returns the duration until the given timestamp.
   * If the timestamp lies before this timestamp, the duration is negative.
   * If the timestamp lies after this timestamp, the duration is positive.
   */
  until(otherTimestamp: TimestampInput): Duration
  /**
   * Returns the duration since the given timestamp.
   * If the timestamp lies before this timestamp, the duration is positive.
   * If the timestamp lies after this timestamp, the duration is negative.
   */
  since(otherTimestamp: TimestampInput): Duration
}
