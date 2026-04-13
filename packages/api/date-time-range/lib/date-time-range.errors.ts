import { DateTimeRange } from './date-time-range.js'

export class InvalidDateTimeRangeBounds extends Error {
  constructor (
    private dateRange: DateTimeRange
  ) {
    const startDate = dateRange.from.toISOString()
    const endDate = dateRange.until.toISOString()

    super(`[DateTimeRange] start date ${startDate} must lie before end date ${endDate}`)
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
