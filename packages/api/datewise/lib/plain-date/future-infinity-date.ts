import { Duration, DurationUnit } from '@wisemen/quantity'
import { Timezone } from '../common/timezone.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { Timestamp, timestamp } from '../timestamp/index.js'
import { PlainDateUnit, DiffPlainDateUnit, ReachablePlainDateUnit } from './plain-date.units.js'
import { PlainDateObject } from './plain-date-object.js'
import { PlainDate, PlainDateInput } from './plain-date.js'
import { factory } from './plain-date.factory.js'

export class FutureInfinityDate implements PlainDate {
  isSame (otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    const parsed = factory(otherDate)

    return parsed.isFutureInfinity()
  }

  isAfter (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return true
  }

  isSameOrAfter (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return true
  }

  isBefore (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return false
  }

  isSameOrBefore (otherDate: PlainDateInput, unit?: PlainDateUnit): boolean {
    return this.isSame(otherDate, unit)
  }

  startOf (_unit: ReachablePlainDateUnit): FutureInfinityDate {
    return this
  }

  endOf (_unit: ReachablePlainDateUnit): FutureInfinityDate {
    return this
  }

  year (): number {
    return Infinity
  }

  month (): number {
    return Infinity
  }

  dayOfMonth (): number {
    return Infinity
  }

  weekOfYear (): number {
    return Infinity
  }

  dayOfYear (): number {
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

  add (_amount: number, _unit: PlainDateUnit): FutureInfinityDate {
    return this
  }

  subtract (_amount: number, _unit: PlainDateUnit): FutureInfinityDate {
    return this
  }

  until (otherDate: PlainDateInput): Duration {
    if (this.isSame(otherDate)) {
      return new Duration(0, DurationUnit.DAYS)
    } else {
      return new Duration(-Infinity, DurationUnit.DAYS)
    }
  }

  since (otherDate: PlainDateInput): Duration {
    if (this.isSame(otherDate)) {
      return new Duration(0, DurationUnit.DAYS)
    } else {
      return new Duration(Infinity, DurationUnit.DAYS)
    }
  }

  diff (_withOther: PlainDateInput, _unit: DiffPlainDateUnit, _precise = false): number {
    return Infinity
  }

  format (_template: string): string {
    return 'future infinity'
  }

  clone (): FutureInfinityDate {
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

  toJSON (): string {
    return 'infinity'
  }

  valueOf (): string {
    return this.toString()
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

  toTimestamp (_withTime?: PlainTime, _timezone?: Timezone): Timestamp {
    return timestamp.futureInfinity()
  }
}
