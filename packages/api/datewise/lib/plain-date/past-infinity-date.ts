import { Duration, DurationUnit } from '@wisemen/quantity'
import { Timezone } from '../common/timezone.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { FutureInfinity } from '../timestamp/future-infinity.js'
import { DayjsPlainDate } from './dayjs-plain-date.js'
import { PlainDateUnit, DiffPlainDateUnit, ReachablePlainDateUnit } from './plain-date.units.js'
import { PlainDateObject } from './plain-date-object.js'
import { PlainDate, PlainDateInput } from './plain-date.js'
import { factory } from './plain-date.factory.js'

export class PastInfinityDate implements PlainDate {
  isSame (otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    const parsed = factory(otherDate)

    return parsed.isPastInfinity()
  }

  isAfter (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return false
  }

  isSameOrAfter (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return this.isSame(_otherDate, _unit)
  }

  isBefore (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return true
  }

  isSameOrBefore (_otherDate: PlainDateInput, _unit?: PlainDateUnit): boolean {
    return true
  }

  startOf (_unit: ReachablePlainDateUnit): PastInfinityDate {
    return this
  }

  endOf (_unit: ReachablePlainDateUnit): PastInfinityDate {
    return this
  }

  year (): number {
    return -Infinity
  }

  month (): number {
    return -Infinity
  }

  dayOfMonth (): number {
    return -Infinity
  }

  weekOfYear (): number {
    return -Infinity
  }

  dayOfYear (): number {
    return -Infinity
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

  add (_amount: number, _unit: PlainDateUnit): PastInfinityDate {
    return this
  }

  subtract (_amount: number, _unit: PlainDateUnit): PastInfinityDate {
    return this
  }

  until (otherDate: PlainDateInput): Duration {
    if (this.isSame(otherDate)) {
      return new Duration(0, DurationUnit.DAYS)
    } else {
      return new Duration(Infinity, DurationUnit.DAYS)
    }
  }

  since (otherDate: PlainDateInput): Duration {
    if (this.isSame(otherDate)) {
      return new Duration(0, DurationUnit.DAYS)
    } else {
      return new Duration(-Infinity, DurationUnit.DAYS)
    }
  }

  diff (_withOther: DayjsPlainDate, _unit: DiffPlainDateUnit, _precise = false): number {
    return Infinity
  }

  format (_template: string): string {
    return '-infinity'
  }

  clone (): PastInfinityDate {
    return this
  }

  toPlainObject (): PlainDateObject {
    return {
      year: -Infinity,
      month: -Infinity,
      day: -Infinity
    }
  }

  toString (): string {
    return '-infinity'
  }

  toJSON (): string {
    return '-infinity'
  }

  valueOf (): string {
    return this.toString()
  }

  isFutureInfinity (): boolean {
    return false
  }

  isPastInfinity (): boolean {
    return true
  }

  isInfinity (): boolean {
    return true
  }

  toTimestamp (_withTime?: PlainTime, _timezone?: Timezone): FutureInfinity {
    return new FutureInfinity()
  }

  day (): number {
    throw new Error('cannot access day of week of -infinity')
  }

  toDate (): Date {
    throw new Error('cannot convert past infinity to a Date')
  }
}
