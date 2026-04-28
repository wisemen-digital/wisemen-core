import { DateTimeRange } from './date-time-range.js'

export class InvalidDateTimeRangeBounds extends Error {
  constructor (
    private dateRange: DateTimeRange
  ) {
    const startDate = dateRange.inclLower.toISOString()
    const endDate = dateRange.inclUpper.toISOString()

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
