import { IsPlainDate, PlainDateApiProperty } from '../plain-date/index.js'
import { DateRange } from './date-range.js'
import { InclusivityString } from '../common/inclusivity.js'

export class DateRangeDto {
  @PlainDateApiProperty()
  @IsPlainDate()
  startDate: string

  @PlainDateApiProperty()
  @IsPlainDate()
  endDate: string

  /**
   * Parse this dto into a DateRange instance.
   * @param inclusivity defaults to `[]`
   */
  parse (inclusivity: InclusivityString = '[]'): DateRange {
    return new DateRange(this.startDate, this.endDate, inclusivity)
  }
}
