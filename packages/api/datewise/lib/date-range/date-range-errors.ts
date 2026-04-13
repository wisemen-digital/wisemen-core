import { DateRange } from './date-range.js'

export class InvalidDateRangeBounds extends Error {
  constructor (dateRange: DateRange) {
    const startDate = dateRange.startDate.toString()
    const endDate = dateRange.endDate.toString()

    super(`[DateRange] start date ${startDate} must lie before end date ${endDate}`)
  }
}

export class NoDateRangeOverlap extends Error {
  constructor (public firstRange: DateRange, public secondRange: DateRange) {
    super()
  }
}
