import { DateTimeRangeFilter } from '#src/date-time-range-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { DateTimeRange, DateTimeRangeDto } from '@wisemen/datewise'
import { FindOperator } from 'typeorm'
import { binaryRawCondition } from '#src/typeorm/helpers.js'

function parseRangeValue (value: DateTimeRange | DateTimeRangeDto): DateTimeRange {
  if (value instanceof DateTimeRange) {
    return value
  }

  return value.parse()
}

export function MatchesDateTimeRange (
  filter: DateTimeRangeFilter | undefined
): FindOperator<DateTimeRange> | undefined {
  if (filter === undefined) {
    return undefined
  }

  const value = parseRangeValue(filter.value).toString()

  switch (filter.condition) {
    case RangeFilterCondition.OVERLAPS:
      return binaryRawCondition<DateTimeRange>('&&', value, { cast: 'tstzrange3' })
    case RangeFilterCondition.DOES_NOT_OVERLAP:
      return binaryRawCondition<DateTimeRange>('&&', value, { cast: 'tstzrange3', negate: true })
    case RangeFilterCondition.CONTAINS:
      return binaryRawCondition<DateTimeRange>('@>', value, { cast: 'tstzrange3' })
    case RangeFilterCondition.DOES_NOT_CONTAIN:
      return binaryRawCondition<DateTimeRange>('@>', value, { cast: 'tstzrange3', negate: true })
  }
}
