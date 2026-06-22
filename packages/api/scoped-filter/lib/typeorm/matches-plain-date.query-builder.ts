import { DateFilterCondition } from '#src/date-filter-condition.js'
import { PlainDateFilter } from '#src/plain-date-filter.js'
import { binaryQueryBuilderCondition } from '#src/typeorm/helpers.js'
import { plainDate } from '@wisemen/datewise'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export function matchesPlainDate<T extends ObjectLiteral> (
  column: string,
  filter: PlainDateFilter
): (qb: SelectQueryBuilder<T>) => string {
  const value = plainDate(filter.value).toString()

  switch (filter.condition) {
    case DateFilterCondition.EQUAL:
      return binaryQueryBuilderCondition(column, '=', value, { cast: 'date' })
    case DateFilterCondition.NOT_EQUAL:
      return binaryQueryBuilderCondition(column, '!=', value, { cast: 'date' })
    case DateFilterCondition.BEFORE:
      return binaryQueryBuilderCondition(column, '<', value, { cast: 'date' })
    case DateFilterCondition.AFTER:
      return binaryQueryBuilderCondition(column, '>', value, { cast: 'date' })
  }
}
