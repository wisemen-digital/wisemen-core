import { DateTimeRange } from './date-time-range.js'
import { TimestampApiProperty } from './timestamp.api-property.js'

export class DateTimeRangeResponse {
  @TimestampApiProperty()
  startDate: string

  @TimestampApiProperty()
  endDate: string

  constructor (dateRange: DateTimeRange) {
    this.startDate = dateRange.from.toISOString()
    this.endDate = dateRange.until.toISOString()
  }
}
