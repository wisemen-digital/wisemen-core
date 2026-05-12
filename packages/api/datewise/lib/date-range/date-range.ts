import { Inclusivity, InclusivityString, mapToInclusivity, isInclusive } from '../common/inclusivity.js'
import { PlainDate, PlainDateInput } from '../plain-date/plain-date.js'
import { plainDate } from '../plain-date/index.js'
import { DatePeriod } from '../common/date-period.enum.js'
import { InvalidDateRangeBounds, NoDateRangeOverlap } from './date-range-errors.js'

/**
 * DateRange only works with inclusive ranges internally, except for infinities
 * When an exclusive date is given, this date is mapped to the next or previous inclusive date
 * for the upper and lower bound respectively
 *
 * As a result, empty ranges cannot be represented.
 */
export class DateRange {
  readonly startDate: PlainDate
  readonly endDate: PlainDate

  constructor (
    startDate: PlainDateInput,
    endDate: PlainDateInput,
  )
  constructor (
    startDate: PlainDateInput,
    endDate: PlainDateInput,
    inclusivity: Inclusivity
  )
  constructor (
    startDate: PlainDateInput,
    endDate: PlainDateInput,
    inclusivity: InclusivityString
  )
  constructor (
    startDate: PlainDateInput,
    endDate: PlainDateInput,
    lowerBoundInclusivity: Inclusivity,
    upperBoundInclusivity: Inclusivity
  )
  constructor (
    startDate: PlainDateInput,
    endDate: PlainDateInput,
    lowerBoundOrBoundsInclusivity: Inclusivity | InclusivityString = Inclusivity.INCLUSIVE,
    upperBoundInclusivity?: Inclusivity
  ) {
    if (typeof lowerBoundOrBoundsInclusivity === 'string') {
      const [lower, upper] = mapToInclusivity(lowerBoundOrBoundsInclusivity)

      lowerBoundOrBoundsInclusivity = lower
      upperBoundInclusivity = upper
    } else if (upperBoundInclusivity === undefined) {
      upperBoundInclusivity = lowerBoundOrBoundsInclusivity
    }

    let start = plainDate(startDate)

    if (!isInclusive(lowerBoundOrBoundsInclusivity)) {
      start = start.add(1, 'day')
    }

    let end = plainDate(endDate)

    if (!isInclusive(upperBoundInclusivity)) {
      end = end.subtract(1, 'day')
    }

    this.startDate = start
    this.endDate = end

    if (end.isBefore(start) && start.isAfter(end)) {
      throw new InvalidDateRangeBounds(this)
    }
  }

  get years (): number {
    return this.endDate.diff(this.startDate, 'years')
  }

  get months (): number {
    return this.endDate.diff(this.startDate, 'months')
  }

  get quarters (): number {
    return this.endDate.diff(this.startDate, 'quarters')
  }

  get weeks (): number {
    return this.endDate.diff(this.startDate, 'weeks')
  }

  get days (): number {
    return this.endDate.diff(this.startDate, 'days')
  }

  contains (date: PlainDateInput): boolean {
    const parsed = plainDate(date)

    return !parsed.isPastInfinity() && !parsed.isFutureInfinity()
      && parsed.isSameOrAfter(this.startDate) && parsed.isSameOrBefore(this.endDate)
  }

  startsAfter (date: PlainDateInput): boolean {
    return plainDate(date).isBefore(this.startDate)
  }

  startsAfterOrOn (date: PlainDateInput): boolean {
    return plainDate(date).isSameOrBefore(this.startDate)
  }

  startsBefore (date: PlainDateInput): boolean {
    return this.startDate.isBefore(date)
  }

  startsBeforeOrOn (date: PlainDateInput): boolean {
    return this.startDate.isSameOrBefore(date)
  }

  endsBefore (date: PlainDateInput): boolean {
    return this.endDate.isBefore(date)
  }

  endsBeforeOrOn (date: PlainDateInput): boolean {
    return this.endDate.isSameOrBefore(date)
  }

  endsAfter (date: PlainDateInput): boolean {
    return this.endDate.isAfter(date)
  }

  endsAfterOrOn (date: PlainDateInput): boolean {
    return this.endDate.isSameOrAfter(date)
  }

  getDatePeriod (on: PlainDateInput = plainDate.today()): DatePeriod {
    if (this.contains(on)) {
      return DatePeriod.ACTIVE
    } else if (this.startsAfter(on)) {
      return DatePeriod.FUTURE
    } else {
      return DatePeriod.PAST
    }
  }

  overlaps (withRange: DateRange): boolean {
    return this.startDate.isSameOrBefore(withRange.endDate)
      && this.endDate.isSameOrAfter(withRange.startDate)
  }

  overlap (withRange: DateRange): DateRange {
    if (!this.overlaps(withRange)) throw new NoDateRangeOverlap(this, withRange)

    const { startDate: startA, endDate: endA } = this
    const { startDate: startB, endDate: endB } = withRange

    return new DateRange(
      plainDate.max(startA, startB),
      plainDate.min(endA, endB)
    )
  }

  diff (withRange: DateRange): DateRange[] {
    if (!this.overlaps(withRange)) {
      return [this]
    }

    const overlap = this.overlap(withRange)
    const difference: DateRange[] = []

    if (overlap.startDate.isAfter(this.startDate)) {
      difference.push(new DateRange(this.startDate, overlap.startDate.subtract(1, 'day')))
    }

    if (overlap.endDate.isBefore(this.endDate)) {
      difference.push(new DateRange(overlap.endDate.add(1, 'day'), this.endDate))
    }

    return difference
  }

  isSame (otherRange: DateRange): boolean {
    return this.startDate.isSame(otherRange.startDate)
      && this.endDate.isSame(otherRange.endDate)
  }

  isFinite (): boolean {
    return (!this.startDate.isInfinity()) && (!this.endDate.isInfinity())
  }

  toString (): string {
    const startInclusivity = this.startDate.isInfinity() ? `(` : '['
    const endInclusivity = this.endDate.isInfinity() ? `)` : ']'

    return startInclusivity + this.startDate.toString() + ',' + this.endDate.toString() + endInclusivity
  }

  valueOf (): string {
    return this.toString()
  }

  setEndDate (endDate: PlainDateInput): DateRange {
    return new DateRange(this.startDate, endDate)
  }

  setStartDate (startDate: PlainDateInput): DateRange {
    return new DateRange(startDate, this.endDate)
  }

  /** Returns true if this range ends before the other range starts */
  isStrictlyBefore (other: DateRange): boolean {
    return this.endDate.isBefore(other.startDate)
  }

  /** Returns true if this range starts after the other range ends */
  isStrictlyAfter (other: DateRange): boolean {
    return this.startDate.isAfter(other.endDate)
  }

  precedes (other: DateRange): boolean {
    return (!this.endDate.isFutureInfinity())
      && (this.endDate.add(1, 'day').isSame(other.startDate))
  }

  isPrecededBy (other: DateRange): boolean {
    return other.precedes(this)
  }

  succeeds (other: DateRange): boolean {
    return (!this.startDate.isPastInfinity())
      && (this.startDate.subtract(1, 'day').isSame(other.endDate))
  }

  isSucceededBy (other: DateRange): boolean {
    return other.succeeds(this)
  }

  isAdjacentTo (other: DateRange): boolean {
    return this.precedes(other) || this.succeeds(other)
  }

  merge (withOther: DateRange): DateRange {
    if (this.isPrecededBy(withOther)) {
      return this.setStartDate(withOther.startDate)
    } else if (this.isSucceededBy(withOther)) {
      return this.setEndDate(withOther.endDate)
    } else {
      throw new Error('cannot merge non adjacent date ranges')
    }
  }

  /** 
   * Compares the order of the given date range with this date range. \
   * Ranges are compared first by their start date, then by their end date. \
   * returns < 0 if this range starts before the other (or starts at the same time but ends before) \
   * returns 0 if both ranges have the same start and end dates \
   * returns > 0 if this range starts after the other (or starts at the same time but ends after) \
   * \
   * This method is useful for sorting arrays of date ranges.
  */
  compare (withOther: DateRange): number {
    const startComparison = this.startDate.compare(withOther.startDate)

    if (startComparison !== 0) {
      return startComparison
    }

    return this.endDate.compare(withOther.endDate)
  }
}
