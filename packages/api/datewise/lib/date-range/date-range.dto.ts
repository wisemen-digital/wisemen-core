import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsPlainDate } from '../plain-date/index.js'
import { DateRange } from './date-range.js'

export class DateRangeDto extends FilterQuery {
  @ApiProperty({ format: 'date' })
  @IsPlainDate()
  startDate: string

  @ApiProperty({ format: 'date' })
  @IsPlainDate()
  endDate: string

  parse (): DateRange {
    return new DateRange(this.startDate, this.endDate)
  }
}
