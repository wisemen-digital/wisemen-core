import { TimestampApiProperty } from '../timestamp/index.js'
import { DateTimeRange } from './date-time-range.js'

export class DateTimeRangeResponse {
  @TimestampApiProperty({ description: 'start of the range, inclusive' })
  from: string

  @TimestampApiProperty({ description: 'end of the range, exclusive' })
  until: string

  constructor (dateRange: DateTimeRange) {
    this.from = dateRange.from.toISOString()
    this.until = dateRange.until.toISOString()
  }
}
