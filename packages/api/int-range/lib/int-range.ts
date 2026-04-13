import { Inclusivity, InclusivityString, isInclusive, mapToInclusivity } from './inclusivity.js'
import { InvalidIntRangeBounds, NoIntRangeOverlap, UnsafeIntRangeValue } from './int-range.errors.js'

/**
 * IntRange only works with inclusive ranges internally
 * When an exclusive bound is given, this bound is mapped to the next or previous inclusive value
 * for the upper and lower bound respectively
 *
 * As a result, empty ranges cannot be represented.
 */
export class IntRange {
  readonly from: number
  readonly until: number

  constructor (
    from: number,
    until: number,
  )
  constructor (
    from: number,
    until: number,
    inclusivity: Inclusivity
  )
  constructor (
    from: number,
    until: number,
    inclusivitiy: InclusivityString
  )
  constructor (
    from: number,
    until: number,
    lowerBoundInclusivity: Inclusivity,
    upperBoundInclusivity: Inclusivity
  )
  constructor (
    from: number,
    until: number,
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

    if (!isInclusive(lowerBoundOrBoundsInclusivity)) {
      from = from + 1
    }

    if (!isInclusive(upperBoundInclusivity)) {
      until = until - 1
    }

    if (!Number.isSafeInteger(from)) {
      throw new UnsafeIntRangeValue(from, 'from')
    }

    if (!Number.isSafeInteger(until)) {
      throw new UnsafeIntRangeValue(until, 'until')
    }

    this.from = from
    this.until = until

    if (until < from) {
      throw new InvalidIntRangeBounds(this)
    }
  }

  /** Returns the size of the range (inclusive count). */
  get size (): number {
    return this.until - this.from + 1
  }

  /** Checks if the given value falls within the range. */
  contains (value: number): boolean {
    return value >= this.from && value <= this.until
  }

  /** Returns true if the range starts after the given value. */
  startsAfter (value: number): boolean {
    return value < this.from
  }

  /** Returns true if the range ends before the given value. */
  endsBefore (value: number): boolean {
    return value > this.until
  }

  /** Returns true if the range overlaps with another IntRange. */
  overlaps (withRange: IntRange): boolean {
    return this.from <= withRange.until
      && this.until >= withRange.from
  }

  /** Returns the overlapping range with another IntRange, or throws if none. */
  overlap (withRange: IntRange): IntRange {
    if (!this.overlaps(withRange)) {
      throw new NoIntRangeOverlap(this, withRange)
    }

    const { from: startA, until: endA } = this
    const { from: startB, until: endB } = withRange

    return new IntRange(Math.max(startA, startB), Math.min(endA, endB))
  }

  /** Returns the portions of the range not covered by another IntRange as an array. */
  diff (withRange: IntRange): IntRange[] {
    if (!this.overlaps(withRange)) {
      return [this]
    }

    const overlap = this.overlap(withRange)
    const difference: IntRange[] = []

    if (overlap.from > this.from) {
      difference.push(new IntRange(this.from, overlap.from - 1))
    }

    if (overlap.until < this.until) {
      difference.push(new IntRange(overlap.until + 1, this.until))
    }

    return difference
  }

  /** Checks if both ranges have the same boundaries. */
  isSame (otherRange: IntRange): boolean {
    return this.from === otherRange.from
      && this.until === otherRange.until
  }

  /**
   * Returns a string representation of the range, indicating inclusivity and bounds.
   * @example "[1,10)"
   */
  toString (): string {
    return '[' + this.from + ',' + (this.until + 1) + ')'
  }

  /** Returns a new IntRange with updated end boundary. */
  setUntil (until: number): IntRange {
    return new IntRange(this.from, until)
  }

  /** Returns a new IntRange with updated start boundary. */
  setFrom (from: number): IntRange {
    return new IntRange(from, this.until)
  }

  /** Returns true if this range ends immediately (1 unit) before the other range starts. */
  precedes (other: IntRange): boolean {
    return this.until + 1 === other.from
  }

  /** Returns true if this range is immediately (1 unit) preceded by the other range. */
  isPrecededBy (other: IntRange): boolean {
    return other.precedes(this)
  }

  /** Returns true if this range starts immediately (1 unit) after the other range ends. */
  succeeds (other: IntRange): boolean {
    return this.from - 1 === other.until
  }

  /** Returns true if this range is immediately (1 unit) succeeded by the other range. */
  isSucceededBy (other: IntRange): boolean {
    return other.succeeds(this)
  }

  /** Returns true if the ranges are directly adjacent (preceding or succeeding). */
  isAdjacentTo (other: IntRange): boolean {
    return this.precedes(other) || this.succeeds(other)
  }

  /** Merges two adjacent ranges into one; throws if not adjacent. */
  merge (withOther: IntRange): IntRange {
    if (this.isPrecededBy(withOther)) {
      return this.setFrom(withOther.from)
    } else if (this.isSucceededBy(withOther)) {
      return this.setUntil(withOther.until)
    } else {
      throw new Error('cannot merge non adjacent int ranges')
    }
  }
}
