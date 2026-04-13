import { ApiProperty } from '@nestjs/swagger'
import { IsWiseDateString, wiseDate } from '@wisemen/wise-date'
import { FilterQuery } from '@wisemen/pagination'
import { DateRange } from './date-range.js'

export class DateRangeDto extends FilterQuery {
  @ApiProperty({ format: 'date' })
  @IsWiseDateString()
  startDate: string

  @ApiProperty({ format: 'date' })
  @IsWiseDateString()
  endDate: string

  parse (): DateRange {
    const startDate = wiseDate(this.startDate)
    const endDate = wiseDate(this.endDate)

    return new DateRange(startDate, endDate)
  }
}
