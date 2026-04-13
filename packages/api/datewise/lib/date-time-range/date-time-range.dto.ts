import { FilterQuery } from '@wisemen/pagination'
import { IsTimestamp, TimestampApiProperty } from '../timestamp/index.js'
import { DateTimeRange } from './date-time-range.js'

export class DateTimeRangeDto extends FilterQuery {
  @TimestampApiProperty({ description: 'start of the range, inclusive' })
  @IsTimestamp({ isBefore: (dto: DateTimeRangeDto) => dto.until })
  from: string

  @TimestampApiProperty({ description: 'end of the range, exclusive' })
  @IsTimestamp({ isAfter: (dto: DateTimeRangeDto) => dto.from })
  until: string

  parse (): DateTimeRange {
    return new DateTimeRange(this.from, this.until)
  }
}
