import { FilterQuery } from '@wisemen/pagination'
import { IsTimestamp, TimestampApiProperty } from '../timestamp/index.js'
import { DateTimeRange } from './date-time-range.js'
import { InclusivityString } from '../common/inclusivity.js'

export class DateTimeRangeDto implements FilterQuery {
  @TimestampApiProperty({ description: 'start of the range, inclusive' })
  @IsTimestamp({ isBefore: (dto: DateTimeRangeDto) => dto.until })
  from: string

  @TimestampApiProperty({ description: 'end of the range, exclusive' })
  @IsTimestamp({ isAfter: (dto: DateTimeRangeDto) => dto.from })
  until: string

  /**
   * Parse this dto into a DateRange instance.
   * @param inclusivity defaults to `[)`
   */
  parse (inclusivity: InclusivityString = '[)'): DateTimeRange {
    return new DateTimeRange(this.from, this.until, inclusivity)
  }
}
