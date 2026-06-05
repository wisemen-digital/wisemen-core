import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsPlainDate } from '../plain-date/index.js'
import { DateRange } from './date-range.js'
import { InclusivityString } from '../common/inclusivity.js'

export class DateRangeDto implements FilterQuery {
  @ApiProperty({ format: 'date' })
  @IsPlainDate()
  startDate: string

  @ApiProperty({ format: 'date' })
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
