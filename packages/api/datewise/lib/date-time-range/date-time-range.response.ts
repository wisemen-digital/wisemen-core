import { TimestampApiProperty } from '../timestamp/index.js'
import { DateTimeRange } from './date-time-range.js'

export class DateTimeRangeResponse {
  static from (range: DateTimeRange): DateTimeRangeResponse
  static from (range: null): | null
  static from (range: DateTimeRange | null): DateTimeRangeResponse | null 
  static from (range: DateTimeRange | null): DateTimeRangeResponse | null {
    return range !== null ? new DateTimeRangeResponse(range) : null
  }

  @TimestampApiProperty({ description: 'start of the range, inclusive' })
  from: string

  @TimestampApiProperty({ description: 'end of the range, exclusive' })
  until: string

  constructor (dateRange: DateTimeRange) {
    this.from = dateRange.inclLower.toISOString()
    this.until = dateRange.exclUpper.toISOString()
  }
}
