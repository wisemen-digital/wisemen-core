import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsPlainDate } from '../plain-date/index.js'
import { DateRange } from './date-range.js'
import { DateRangeDtoBuilder } from './date-range.dto-builder.js'

export class DateRangeDto extends FilterQuery {
  @ApiProperty({ format: 'date' })
  @IsPlainDate()
  startDate: string

  @ApiProperty({ format: 'date' })
  @IsPlainDate()
  endDate: string

  static from (range: null): null
  static from (range: undefined): undefined
  static from (range: DateRange): DateRangeDto
  static from (range: DateRange | null | undefined): DateRangeDto | null | undefined
  static from (range: DateRange | null | undefined): DateRangeDto | null | undefined {
    if (range === null) {
      return null
    }

    if (range === undefined) {
      return undefined
    }

    return new DateRangeDtoBuilder()
      .withStartDate(range.startDate.toString())
      .withEndDate(range.endDate.toString())
      .build()
  }

  parse (): DateRange {
    return new DateRange(this.startDate, this.endDate)
  }
}
