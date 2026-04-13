import { IntRange } from './int-range.js'

export class InvalidIntRangeBounds extends Error {
  constructor (
    private intRange: IntRange
  ) {
    const start = intRange.from
    const end = intRange.until

    super(`[IntRange] start ${start} must be less than or equal to end ${end}`)
  }
}

export class NoIntRangeOverlap extends Error {
  constructor (
    public firstRange: IntRange,
    public secondRange: IntRange
  ) {
    super()
  }
}

export class UnsafeIntRangeValue extends Error {
  constructor (
    value: number,
    boundType: 'from' | 'until'
  ) {
    super(
      `[IntRange] ${boundType} value ${value} exceeds safe integer range [${Number.MIN_SAFE_INTEGER}, ${Number.MAX_SAFE_INTEGER}]`
    )
  }
}
