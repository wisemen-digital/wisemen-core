import { WiseDateApiProperty } from '@wisemen/wise-date'
import { DateRange } from './date-range.js'

export class DateRangeResponse {
  @WiseDateApiProperty()
  startDate: string

  @WiseDateApiProperty()
  endDate: string

  constructor (dateRange: DateRange) {
    this.startDate = dateRange.startDate.toString()
    this.endDate = dateRange.endDate.toString()
  }
}
