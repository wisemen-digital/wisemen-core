import { DateRangeFilter } from '#src/date-range-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { binaryQueryBuilderCondition } from '#src/typeorm/helpers.js'
import { DateRange, DateRangeDto } from '@wisemen/datewise'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

function parseRangeValue (value: DateRange | DateRangeDto): DateRange {
  if (value instanceof DateRange) {
    return value
  }

  return value.parse()
}

export function matchesDateRange<T extends ObjectLiteral> (
  column: string,
  filter: DateRangeFilter
): (qb: SelectQueryBuilder<T>) => string {
  const value = parseRangeValue(filter.value).toString()

  switch (filter.condition) {
    case RangeFilterCondition.OVERLAPS:
      return binaryQueryBuilderCondition(column, '&&', value, { cast: 'daterange' })
    case RangeFilterCondition.DOES_NOT_OVERLAP:
      return binaryQueryBuilderCondition(column, '&&', value, { cast: 'daterange', negate: true })
    case RangeFilterCondition.CONTAINS:
      return binaryQueryBuilderCondition(column, '@>', value, { cast: 'daterange' })
    case RangeFilterCondition.DOES_NOT_CONTAIN:
      return binaryQueryBuilderCondition(column, '@>', value, { cast: 'daterange', negate: true })
  }
}
