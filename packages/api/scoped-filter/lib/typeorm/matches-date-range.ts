import { DateRangeFilter } from '#src/date-range-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { DateRange, DateRangeDto } from '@wisemen/datewise'
import { FindOperator } from 'typeorm'
import { binaryRawCondition } from '#src/typeorm/helpers.js'

function parseRangeValue (value: DateRange | DateRangeDto): DateRange {
  if (value instanceof DateRange) {
    return value
  }

  return value.parse()
}

export function MatchesDateRange (
  filter: DateRangeFilter | undefined
): FindOperator<DateRange> | undefined {
  if (filter === undefined) {
    return undefined
  }

  const value = parseRangeValue(filter.value).toString()

  switch (filter.condition) {
    case RangeFilterCondition.OVERLAPS:
      return binaryRawCondition<DateRange>('&&', value, { cast: 'daterange' })
    case RangeFilterCondition.DOES_NOT_OVERLAP:
      return binaryRawCondition<DateRange>('&&', value, { cast: 'daterange', negate: true })
    case RangeFilterCondition.CONTAINS:
      return binaryRawCondition<DateRange>('@>', value, { cast: 'daterange' })
    case RangeFilterCondition.DOES_NOT_CONTAIN:
      return binaryRawCondition<DateRange>('@>', value, { cast: 'daterange', negate: true })
  }
}
