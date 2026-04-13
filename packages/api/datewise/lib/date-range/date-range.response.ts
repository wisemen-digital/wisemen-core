import { PlainDateApiProperty } from '../plain-date/index.js'
import { DateRange } from './date-range.js'

export class DateRangeResponse {
  @PlainDateApiProperty()
  startDate: string

  @PlainDateApiProperty()
  endDate: string

  constructor (dateRange: DateRange) {
    this.startDate = dateRange.startDate.toString()
    this.endDate = dateRange.endDate.toString()
  }
}
