import { isDate } from 'util/types'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import { Inclusivity, InclusivityString, isInclusive, mapToInclusivity } from './inclusivity.js'
import { InvalidDateTimeRangeBounds, NoDateTimeRangeOverlap } from './date-time-range.errors.js'
import { max, min, Timestamp, TimestampInput } from './timestamp.js'
import { timestamp } from './timestamp.factory.js'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

/**
 * DateTimeRange only works with inclusive ranges internally, except for infinities
 * When an exclusive date is given, this date is mapped to the next or previous inclusive date
 * for the upper and lower bound respectively
 *
 * As a result, empty ranges cannot be represented.
 * DateTimeRange uses a maximum precision of milliseconds.
 */
export class DateTimeRange {
  readonly from: Timestamp
  readonly until: Timestamp

  constructor (
    from: TimestampInput,
    until: TimestampInput,
  )
  constructor (
    from: TimestampInput,
    until: TimestampInput,
    inclusivity: Inclusivity
  )
  constructor (
    from: TimestampInput,
    until: TimestampInput,
    inclusivitiy: InclusivityString
  )
  constructor (
    from: TimestampInput,
    until: TimestampInput,
    lowerBoundInclusivity: Inclusivity,
    upperBoundInclusivity: Inclusivity
  )
  constructor (
    from: TimestampInput,
    until: TimestampInput,
    lowerBoundOrBoundsInclusivity: Inclusivity | InclusivityString = Inclusivity.INCLUSIVE,
    upperBoundInclusivity?: Inclusivity
  ) {
    from = timestamp(from)
    until = timestamp(until)

    if (typeof lowerBoundOrBoundsInclusivity === 'string') {
      const [lower, upper] = mapToInclusivity(lowerBoundOrBoundsInclusivity)

      lowerBoundOrBoundsInclusivity = lower
      upperBoundInclusivity = upper
    } else if (upperBoundInclusivity === undefined) {
      upperBoundInclusivity = lowerBoundOrBoundsInclusivity
    }

    if (!isInclusive(lowerBoundOrBoundsInclusivity)) {
      from = from.add(1, 'ms')
    }

    if (!isInclusive(upperBoundInclusivity)) {
      until = until.subtract(1, 'ms')
    }

    this.from = from
    this.until = until

    if (until.isBefore(from) && from.isAfter(until)) {
      throw new InvalidDateTimeRangeBounds(this)
    }
    if (from.isFutureInfinity() && until.isFutureInfinity()) {
      throw new InvalidDateTimeRangeBounds(this)
    }
    if (from.isPastInfinity() && until.isPastInfinity()) {
      throw new InvalidDateTimeRangeBounds(this)
    }
  }

  /** Returns the number of whole years in the range. */
  get years (): number {
    return this.until.diff(this.from, 'years')
  }

  /** Returns the number of whole months in the range. */
  get months (): number {
    return this.until.diff(this.from, 'months')
  }

  /** Returns the number of whole weeks in the range. */
  get weeks (): number {
    return this.until.diff(this.from, 'weeks')
  }

  /** Returns the number of whole days in the range. */
  get days (): number {
    return this.until.diff(this.from, 'days')
  }

  /** Returns the number of whole hours in the range. */
  get hours (): number {
    return this.until.diff(this.from, 'hours')
  }

  /** Returns the number of whole minutes in the range. */
  get minutes (): number {
    return this.until.diff(this.from, 'minutes')
  }

  /** Returns the number of whole seconds in the range. */
  get seconds (): number {
    return this.until.diff(this.from, 'seconds')
  }

  /** Returns the number of whole milliseconds in the range. */
  get milliseconds (): number {
    return this.until.diff(this.from, 'milliseconds')
  }

  /** Checks if the given date falls within the range. */
  contains (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isSameOrAfter(this.from) && date.isSameOrBefore(this.until)
  }

  /** Returns true if the range starts after the given date. */
  startsAfter (date: Timestamp | Date): boolean {
    if (isDate(date)) {
      date = timestamp(date)
    }

    return date.isBefore(this.from)
  }

  /** Returns true if the range ends before the given date. */
  endsBefore (date: Timestamp | Date): boolean {
    if (isDate(date)) {
      date = timestamp(date)
    }

    return date.isAfter(this.until)
  }

  /** Returns true if the range overlaps with another DateTimeRange. */
  overlaps (withRange: DateTimeRange): boolean {
    return this.from.isSameOrBefore(withRange.until)
      && this.until.isSameOrAfter(withRange.from)
  }

  /** Returns the overlapping range with another DateTimeRange, or throws if none. */
  overlap (withRange: DateTimeRange): DateTimeRange {
    if (!this.overlaps(withRange)) {
      throw new NoDateTimeRangeOverlap(this, withRange)
    }

    const { from: startA, until: endA } = this
    const { from: startB, until: endB } = withRange

    return new DateTimeRange(max(startA, startB), min(endA, endB))
  }

  /** Returns the portions of the range not covered by another DateTimeRange as an array. */
  diff (withRange: DateTimeRange, subtract = true): DateTimeRange[] {
    if (!this.overlaps(withRange)) {
      return [this]
    }

    const subtractValue = subtract ? 1 : 0

    const overlap = this.overlap(withRange)
    const difference: DateTimeRange[] = []

    if (overlap.from.isAfter(this.from)) {
      difference.push(new DateTimeRange(this.from, overlap.from.subtract(subtractValue, 'ms')))
    }

    if (overlap.until.isBefore(this.until)) {
      difference.push(new DateTimeRange(overlap.until.add(subtractValue, 'ms'), this.until))
    }

    return difference
  }

  /** Checks if both ranges have the same boundaries. */
  isSame (otherRange: DateTimeRange): boolean {
    return this.from.isSame(otherRange.from)
      && this.until.isSame(otherRange.until)
  }

  /**
   * Returns a string representation of the range, indicating inclusivity and bounds in ISO format.
   * @example "(-infinity, 2025-10-17T14:22:14.768+00]"
   */
  toString (): string {
    const startInclusivity = this.from.isInfinity() ? `(` : '['

    return startInclusivity + this.from.toISOString() + ',' + this.until.add(1, 'ms').toISOString() + ')'
  }

  /** Returns a new DateTimeRange with updated end boundary. */
  setUntil (until: TimestampInput): DateTimeRange {
    until = timestamp(until)

    return new DateTimeRange(this.from, until)
  }

  /** Returns a new DateTimeRange with updated start boundary. */
  setFrom (from: TimestampInput): DateTimeRange {
    from = timestamp(from)

    return new DateTimeRange(from, this.until)
  }

  /** Returns true if this range ends immediately (1ms difference) before the other range starts. */
  precedes (other: DateTimeRange): boolean {
    return (!this.until.isFutureInfinity())
      && (this.until.add(1, 'ms').isSame(other.from))
  }

  /** Returns true if this range is immediately (1ms difference) preceded by the other range. */
  isPrecededBy (other: DateTimeRange): boolean {
    return other.precedes(this)
  }

  /** Returns true if this range starts immediately (1ms difference) after the other range ends. */
  succeeds (other: DateTimeRange): boolean {
    return (!this.from.isPastInfinity())
      && (this.from.subtract(1, 'ms').isSame(other.until))
  }

  /** Returns true if this range is immediately (1ms difference) succeeded by the other range. */
  isSucceededBy (other: DateTimeRange): boolean {
    return other.succeeds(this)
  }

  /** Returns true if the ranges are directly adjacent (preceding or succeeding). */
  isAdjacentTo (other: DateTimeRange): boolean {
    return this.precedes(other) || this.succeeds(other)
  }

  /** Merges two adjacent ranges into one; throws if not adjacent. */
  merge (withOther: DateTimeRange): DateTimeRange {
    if (this.isPrecededBy(withOther)) {
      return this.setFrom(withOther.from)
    } else if (this.isSucceededBy(withOther)) {
      return this.setUntil(withOther.until)
    } else {
      throw new Error('cannot merge non adjacent date time ranges')
    }
  }
}
