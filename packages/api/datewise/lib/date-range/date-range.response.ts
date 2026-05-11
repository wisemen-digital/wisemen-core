import { PlainDateApiProperty } from '../plain-date/index.js'
import { DateRange } from './date-range.js'

export class DateRangeResponse {
  static from (range: DateRange): DateRangeResponse
  static from (range: null): | null
  static from (range: DateRange | null): DateRangeResponse | null {
    return range !== null ? new DateRangeResponse(range) : null
  }

  @PlainDateApiProperty()
  startDate: string

  @PlainDateApiProperty()
  endDate: string

  constructor (dateRange: DateRange) {
    this.startDate = dateRange.startDate.toString()
    this.endDate = dateRange.endDate.toString()
  }
}
