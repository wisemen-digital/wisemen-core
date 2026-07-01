import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { NumberFilter } from '#src/number/number-filter.js'
import { NumberOperation } from '#src/number/number-operation.js'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

/**
 * Checks if the column matches number filter.
 * Best used for query builders.
 *
 * Uses basic SQL number comparison operators.
 *
 * @param column the name of the column to match on.
 * @param filter the number filter to match.
 *
 * @example qb.where(matchNumber('invoice.amount', query.filter.amount))
 */
export function matchNumber<T extends ObjectLiteral> (
  column: string,
  filter: NumberFilter | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined) {
    return undefined
  }

  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    qb.setParameter(paramName, filter.value)

    switch (filter.operation) {
      case NumberOperation.EQUALS:
        return `${column} = :${paramName}`
      case NumberOperation.LESS_THAN:
        return `${column} < :${paramName}`
      case NumberOperation.LESS_THAN_OR_EQUAL:
        return `${column} <= :${paramName}`
      case NumberOperation.MORE_THAN:
        return `${column} > :${paramName}`
      case NumberOperation.MORE_THAN_OR_EQUAL:
        return `${column} >= :${paramName}`
      case NumberOperation.NOT_EQUALS:
        return `${column} != :${paramName}`
      default:
        return exhaustiveCheck(filter.operation)
    }
  }
}
