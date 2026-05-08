import { FilterQuery } from '@wisemen/pagination'
import { IsTimestamp, TimestampApiProperty } from '../timestamp/index.js'
import { DateTimeRange } from './date-time-range.js'
import { DateTimeRangeDtoBuilder } from './date-time-range.dto.builder.js'

export class DateTimeRangeDto extends FilterQuery {
  @TimestampApiProperty({ description: 'start of the range, inclusive' })
  @IsTimestamp({ isBefore: (dto: DateTimeRangeDto) => dto.until })
  from: string

  @TimestampApiProperty({ description: 'end of the range, exclusive' })
  @IsTimestamp({ isAfter: (dto: DateTimeRangeDto) => dto.from })
  until: string

  static from (range: null): null
  static from (range: undefined): undefined
  static from (range: DateTimeRange): DateTimeRangeDto
  static from (range: DateTimeRange | null | undefined): DateTimeRangeDto | null | undefined
  static from (range: DateTimeRange | null | undefined): DateTimeRangeDto | null | undefined {
    if (range === null) {
      return null
    }

    if (range === undefined) {
      return undefined
    }

    return new DateTimeRangeDtoBuilder()
      .withFrom(range.from.toISOString())
      .withUntil(range.until.toISOString())
      .build()
  }

  parse (): DateTimeRange {
    return new DateTimeRange(this.from, this.until)
  }
}
