import { FilterQuery } from '@wisemen/pagination'
import { IsTimestampString } from './is-timestamp-string.validator.js'
import { TimestampApiProperty } from './timestamp.api-property.js'
import { timestamp } from './timestamp.factory.js'
import { DateTimeRange } from './date-time-range.js'

export class DateTimeRangeDto extends FilterQuery {
  @TimestampApiProperty()
  @IsTimestampString()
  startDate: string

  @TimestampApiProperty()
  @IsTimestampString()
  endDate: string

  parse (): DateTimeRange {
    const from = timestamp(this.startDate)
    const until = timestamp(this.endDate)

    return new DateTimeRange(from, until)
  }
}
