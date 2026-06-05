import { DateTimeRange } from './date-time-range.js'

export class InvalidDateTimeRangeBounds extends Error {
  constructor (range: DateTimeRange) {
    super(`[DateTimeRange] invalid range: ${range.toString()}`)
  }
}

export class NoDateTimeRangeOverlap extends Error {
  constructor (
    public firstRange: DateTimeRange,
    public secondRange: DateTimeRange
  ) {
    super()
  }
}
