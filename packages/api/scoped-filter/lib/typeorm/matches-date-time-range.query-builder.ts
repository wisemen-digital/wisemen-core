import { DateTimeRangeFilter } from '#src/date-time-range-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { binaryQueryBuilderCondition } from '#src/typeorm/helpers.js'
import { DateTimeRange, DateTimeRangeDto } from '@wisemen/datewise'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

function parseRangeValue (value: DateTimeRange | DateTimeRangeDto): DateTimeRange {
  if (value instanceof DateTimeRange) {
    return value
  }

  return value.parse()
}

export function matchesDateTimeRange<T extends ObjectLiteral> (
  column: string,
  filter: DateTimeRangeFilter
): (qb: SelectQueryBuilder<T>) => string {
  const value = parseRangeValue(filter.value).toString()

  switch (filter.condition) {
    case RangeFilterCondition.OVERLAPS:
      return binaryQueryBuilderCondition(column, '&&', value, { cast: 'tstzrange3' })
    case RangeFilterCondition.DOES_NOT_OVERLAP:
      return binaryQueryBuilderCondition(column, '&&', value, { cast: 'tstzrange3', negate: true })
    case RangeFilterCondition.CONTAINS:
      return binaryQueryBuilderCondition(column, '@>', value, { cast: 'tstzrange3' })
    case RangeFilterCondition.DOES_NOT_CONTAIN:
      return binaryQueryBuilderCondition(column, '@>', value, { cast: 'tstzrange3', negate: true })
  }
}
