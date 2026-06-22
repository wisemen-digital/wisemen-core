import { NumberFilterCondition } from '#src/number-filter-condition.js'
import { NumberFilter } from '#src/number-filter.js'
import { binaryQueryBuilderCondition } from '#src/typeorm/helpers.js'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export function matchesNumber<T extends ObjectLiteral> (
  column: string,
  filter: NumberFilter
): (qb: SelectQueryBuilder<T>) => string {
  switch (filter.condition) {
    case NumberFilterCondition.EQUAL:
      return binaryQueryBuilderCondition(column, '=', filter.value)
    case NumberFilterCondition.NOT_EQUAL:
      return binaryQueryBuilderCondition(column, '!=', filter.value)
    case NumberFilterCondition.GREATER_THAN:
      return binaryQueryBuilderCondition(column, '>', filter.value)
    case NumberFilterCondition.GREATER_THAN_OR_EQUAL:
      return binaryQueryBuilderCondition(column, '>=', filter.value)
    case NumberFilterCondition.LESS_THAN:
      return binaryQueryBuilderCondition(column, '<', filter.value)
    case NumberFilterCondition.LESS_THAN_OR_EQUAL:
      return binaryQueryBuilderCondition(column, '<=', filter.value)
  }
}
