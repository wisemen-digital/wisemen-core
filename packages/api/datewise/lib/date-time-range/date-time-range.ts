import { Inclusivity, InclusivityString, mapToInclusivity, isInclusive } from '../common/inclusivity.js'
import { timestamp } from '../timestamp/index.js'
import { Timestamp, TimestampInput } from '../timestamp/timestamp.js'
import { MultiDateTimeRange } from '../multi-date-time-range/multi-date-time-range.js'
import { InvalidDateTimeRangeBounds, NoDateTimeRangeOverlap } from './date-time-range.errors.js'

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

  /**
   * @param from inclusive start of the range
   * @param until exclusive end of the range
   */
  constructor (
    from: TimestampInput,
    until: TimestampInput,
  )
  /**
   * @param from start of the range
   * @param until end of the range
   * @param inclusivity inclusivity for both ends of the range
   */
  constructor (
    from: TimestampInput,
    until: TimestampInput,
    inclusivity: InclusivityString
  )
  /**
   * @param from start of the range
   * @param until end of the range
   * @param lowerBoundInclusivity inclusivity for the start of the range (from)
   * @param lowerBoundInclusivity inclusivity for the end of the range (until)
   */
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
    upperBoundInclusivity: Inclusivity = Inclusivity.EXCLUSIVE
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

    if (isInclusive(upperBoundInclusivity)) {
      until = until.add(1, 'ms')
    }

    this.from = from
    this.until = until

    if (until.isSameOrBefore(from) && from.isSameOrAfter(until)) {
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

    return !date.isPastInfinity() && !date.isFutureInfinity()
      && date.isSameOrAfter(this.from) && this.until.isAfter(date)
  }

  /** Checks if the given range is entirely contained within this range */
  containsRange (range: DateTimeRange): boolean {
    return this.from.isSameOrBefore(range.from) && this.until.isSameOrAfter(range.until)
  }

  /** Returns true if the range starts after the given date. */
  startsAfter (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isBefore(this.from)
  }

  /** Returns true if the range starts after or at the given date. */
  startsAfterOrAt (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isSameOrBefore(this.from)
  }

  /** Returns true if the range starts before the given date. */
  startsBefore (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isAfter(this.from)
  }

  /** Returns true if the range starts before or at the given date. */
  startsBeforeOrAt (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isSameOrAfter(this.from)
  }

  /** Returns true if the range ends before the given date. */
  endsBefore (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isAfter(this.until)
  }

  /** Returns true if the range ends before or at the given date. */
  endsBeforeOrAt (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isSameOrAfter(this.until)
  }

  /** Returns true if the range ends after the given date. */
  endsAfter (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isBefore(this.until)
  }

  /** Returns true if the range ends after or at the given date. */
  endsAfterOrAt (date: TimestampInput): boolean {
    date = timestamp(date)

    return date.isSameOrBefore(this.until)
  }

  /** Returns true if the range overlaps with another DateTimeRange. */
  overlaps (withRange: DateTimeRange): boolean {
    return this.from.isBefore(withRange.until) && this.until.isAfter(withRange.from)
  }

  /** Returns the overlapping range with another DateTimeRange, or throws if none. */
  overlap (withRange: DateTimeRange): DateTimeRange {
    if (!this.overlaps(withRange)) {
      throw new NoDateTimeRangeOverlap(this, withRange)
    }

    const { from: startA, until: endA } = this
    const { from: startB, until: endB } = withRange

    return new DateTimeRange(timestamp.max(startA, startB), timestamp.min(endA, endB))
  }

  /** Returns the portions of the range not covered by another DateTimeRange as an array. */
  diff (withRange: DateTimeRange): MultiDateTimeRange {
    if (!this.overlaps(withRange)) {
      return new MultiDateTimeRange([this])
    }

    const overlap = this.overlap(withRange)
    const difference: DateTimeRange[] = []

    if (overlap.from.isAfter(this.from)) {
      difference.push(new DateTimeRange(this.from, overlap.from))
    }

    if (overlap.until.isBefore(this.until)) {
      difference.push(new DateTimeRange(overlap.until, this.until))
    }

    return new MultiDateTimeRange(difference)
  }

  /** Checks if both ranges have the same boundaries. */
  isSame (otherRange: DateTimeRange): boolean {
    return this.from.isSame(otherRange.from)
      && this.until.isSame(otherRange.until)
  }

  /** returns true if both boundaries are finite */
  isFinite (): boolean {
    return (!this.from.isInfinity()) && (!this.until.isInfinity())
  }

  /**
   * Returns a string representation of the range, indicating inclusivity and bounds in ISO format.
   * @example "(-infinity, 2025-10-17T14:22:14.768+00)"
   */
  toString (): string {
    const startInclusivity = this.from.isInfinity() ? `(` : '['

    return startInclusivity + this.from.toISOString() + ',' + this.until.toISOString() + ')'
  }

  toJSON (): string {
    return this.toString()
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

  /** Returns true if this range ends immediately before the other range starts. */
  precedes (other: DateTimeRange): boolean {
    return (!this.until.isFutureInfinity())
      && (this.until.isSame(other.from))
  }

  /** Returns true if this range is immediately preceded by the other range. */
  isPrecededBy (other: DateTimeRange): boolean {
    return other.precedes(this)
  }

  /** Returns true if this range starts immediately  after the other range ends. */
  succeeds (other: DateTimeRange): boolean {
    return (!this.from.isPastInfinity())
      && (this.from.isSame(other.until))
  }

  /** Returns true if this range is immediately  succeeded by the other range. */
  isSucceededBy (other: DateTimeRange): boolean {
    return other.succeeds(this)
  }

  /** Returns true if the ranges are directly adjacent (preceding or succeeding). */
  isAdjacentTo (other: DateTimeRange): boolean {
    return this.precedes(other) || this.succeeds(other)
  }

  /**
   * Merges two overlapping or adjacent ranges into a new range which consists of the
   * earliest timestamp until the latest timestamp of both ranges
   * @throws when ranges do not overlap
   */
  merge (withOther: DateTimeRange): DateTimeRange {
    if (this.isAdjacentTo(withOther)) {
      return this.mergeAdjacent(withOther)
    }

    if (!this.overlaps(withOther)) {
      throw new Error('Invalid argument: no overlap with given range')
    }

    return new DateTimeRange(
      timestamp.min(this.from, withOther.from),
      timestamp.max(this.until, withOther.until)
    )
  }

  /** Merges two adjacent ranges into one; throws if not adjacent. */
  mergeAdjacent (withOther: DateTimeRange): DateTimeRange {
    if (this.isPrecededBy(withOther)) {
      return this.setFrom(withOther.from)
    } else if (this.isSucceededBy(withOther)) {
      return this.setUntil(withOther.until)
    } else {
      throw new Error('cannot merge non adjacent date time ranges')
    }
  }
}
