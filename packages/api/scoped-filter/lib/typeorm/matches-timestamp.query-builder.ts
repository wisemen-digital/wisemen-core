import { DateFilterCondition } from '#src/date-filter-condition.js'
import { TimestampFilter } from '#src/timestamp-filter.js'
import { binaryQueryBuilderCondition } from '#src/typeorm/helpers.js'
import { timestamp } from '@wisemen/datewise'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export function matchesTimestamp<T extends ObjectLiteral> (
  column: string,
  filter: TimestampFilter
): (qb: SelectQueryBuilder<T>) => string {
  const value = timestamp(filter.value).toISOString()

  switch (filter.condition) {
    case DateFilterCondition.EQUAL:
      return binaryQueryBuilderCondition(column, '=', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.NOT_EQUAL:
      return binaryQueryBuilderCondition(column, '!=', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.BEFORE:
      return binaryQueryBuilderCondition(column, '<', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.AFTER:
      return binaryQueryBuilderCondition(column, '>', value, { cast: 'timestamptz(3)' })
  }
}
