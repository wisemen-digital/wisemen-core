import dayjs from 'dayjs'
import { WiseDate } from './wise-date.js'
import { DateUnit, DiffDateUnit, ReachableDateUnit } from './units.js'
import { PlainDateObject } from './plain-date-object.js'

export class FutureInfinityDate extends WiseDate {
  constructor () {
    super(dayjs(8.64e15))
  }

  isSame (otherDate: WiseDate, _unit?: DateUnit): boolean {
    return otherDate instanceof FutureInfinityDate
  }

  isAfter (_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return true
  }

  isSameOrAfter (_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return true
  }

  isBefore (_otherDate: WiseDate, _unit?: DateUnit): boolean {
    return false
  }

  isSameOrBefore (otherDate: WiseDate, unit?: DateUnit): boolean {
    return this.isSame(otherDate, unit)
  }

  startOf (_unit: ReachableDateUnit): WiseDate {
    return this
  }

  endOf (_unit: ReachableDateUnit): WiseDate {
    return this
  }

  get year (): number {
    return Infinity
  }

  get month (): number {
    return Infinity
  }

  get dayOfMonth (): number {
    return Infinity
  }

  get weekOfYear (): number {
    return Infinity
  }

  get dayOfYear (): number {
    return Infinity
  }

  isToday (): boolean {
    return false
  }

  isTomorrow (): boolean {
    return false
  }

  isYesterday (): boolean {
    return false
  }

  public add (_amount: number, _unit: DateUnit): WiseDate {
    return this
  }

  public subtract (_amount: number, _unit: DateUnit): WiseDate {
    return this
  }

  diff (_withOther: WiseDate, _unit: DiffDateUnit, _precise = false): number {
    return Infinity
  }

  format (_template: string): string {
    return 'future infinity'
  }

  clone (): WiseDate {
    return this
  }

  toPlainObject (): PlainDateObject {
    return {
      year: Infinity,
      month: Infinity,
      day: Infinity
    }
  }

  toString (): string {
    return 'infinity'
  }

  isFutureInfinity (): boolean {
    return true
  }

  isPastInfinity (): boolean {
    return false
  }

  isInfinity (): boolean {
    return true
  }

  day (): number {
    throw new Error('cannot access day of week of +infinity')
  }

  toDate (): Date {
    throw new Error('cannot convert future infinity to a Date')
  }
}
