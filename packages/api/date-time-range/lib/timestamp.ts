import { UnitType, ManipulateType, OpUnitType } from 'dayjs'

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

export type TimestampInput = Timestamp | string | Date | null | undefined | number

export interface Timestamp {
  clone(): Timestamp
  isPastInfinity(): boolean
  isFutureInfinity(): boolean
  isInfinity(): boolean
  isValid(): boolean
  year(value?: number): number | Timestamp
  month(value?: number): number | Timestamp
  date(value?: number): number | Timestamp
  day(value?: number): number | Timestamp
  hour(value?: number): number | Timestamp
  minute(value?: number): number | Timestamp
  second(value?: number): number | Timestamp
  millisecond(value?: number): number | Timestamp
  set(unit: UnitType, value: number): Timestamp
  get(unit: UnitType): number
  add(value: number, unit?: ManipulateType): Timestamp
  subtract(value: number, unit?: ManipulateType): Timestamp
  startOf(unit: OpUnitType): Timestamp
  endOf(unit: OpUnitType): Timestamp
  format(template?: string): string
  diff(withOther: TimestampInput, unit: OpUnitType, precise?: boolean): number
  valueOf(): number
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
}

export function max (ts: Timestamp, otherTs: Timestamp): Timestamp {
  return ts.isAfter(otherTs) ? ts : otherTs
}

export function min (ts: Timestamp, otherTs: Timestamp): Timestamp {
  return ts.isBefore(otherTs) ? ts : otherTs
}
