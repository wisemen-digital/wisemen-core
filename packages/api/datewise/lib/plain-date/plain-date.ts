import { Dayjs } from 'dayjs'
import { Duration } from '@wisemen/quantity'
import { Timezone } from '../common/timezone.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { Month } from '../common/month.js'
import { Timestamp } from '../timestamp/timestamp.js'
import { PlainDateObject } from './plain-date-object.js'
import { PlainDateUnit, ReachablePlainDateUnit, DiffPlainDateUnit } from './plain-date.units.js'

export type PlainDateInput
  = Dayjs
    | string
    | Date
    | PlainDateObject
    | PlainDate
    | number
    | Timestamp
    | { toDate(): Date }
    | undefined

export interface PlainDate {
  isSame(otherDate: PlainDateInput): boolean
  isAfter(otherDate: PlainDateInput): boolean
  isSameOrAfter(otherDate: PlainDateInput): boolean
  isBefore(otherDate: PlainDateInput, unit?: PlainDateUnit): boolean
  isSameOrBefore(otherDate: PlainDateInput): boolean
  startOf(unit: ReachablePlainDateUnit): PlainDate
  endOf(unit: ReachablePlainDateUnit): PlainDate
  year(): number
  month(): Month
  dayOfMonth(): number
  weekOfYear(): number
  dayOfYear(): number
  isToday(): boolean
  isTomorrow(): boolean
  isYesterday(): boolean
  add(amount: number, unit: PlainDateUnit): PlainDate
  subtract(amount: number, unit: PlainDateUnit): PlainDate

  /**
   * Returns the duration until the given date.
   * If the date lies before this date, the duration is negative.
   * If the date lies after this date, the duration is positive.
   */
  until(otherDate: PlainDateInput): Duration

  /**
   * Returns the duration since the given date.
   * If the date lies before this date, the duration is positive.
   * If the date lies after this date, the duration is negative.
   */
  since(otherDate: PlainDateInput): Duration
  diff(withOther: PlainDateInput, unit: DiffPlainDateUnit): number
  /** 
   * Compares the order of the given date with this date. \
   * returns < 0 if this date is before the given date \
   * returns 0 if this date is the same as the given date \
   * returns > 0 if this date is after the given date \
   * \
   * Comparing a date with infinities results in `-Infinity` or `Infinity` (Number) \
   * Comparing infinities will result in 0 when they represent the same infinity.
   * \
   * The returned value is the result of a `diff` days between the compared values.
  */
  compare(withOther: PlainDateInput): number
  /** @see https://day.js.org/docs/en/display/format */
  format(template: string): string
  clone(): PlainDate
  toPlainObject(): PlainDateObject
  toDate(withTime?: PlainTime, timezone?: Timezone): Date
  toString(): string
  toJSON(): string
  toTimestamp(withTime?: PlainTime, timezone?: Timezone): Timestamp
  isFutureInfinity(): boolean
  isPastInfinity(): boolean
  /** @returns Returns numbers from 0 (Sunday) to 6 (Saturday). */
  day(): number
  isInfinity(): boolean
  valueOf(): string
}
