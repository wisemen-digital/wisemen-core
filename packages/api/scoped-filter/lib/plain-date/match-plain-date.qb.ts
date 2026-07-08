import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { PlainDateFilter } from '#src/plain-date/plain-date-filter.js'
import { PlainDateOperation } from '#src/plain-date/plain-date-operation.js'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

/**
 * Checks if the column matches a plain date filter.
 * Best used for query builders.
 *
 * @param column the name of the column to match on.
 * @param filter the filter to match.
 * @example qb.where(matchPlainDate('invoice.date', query.filter.date))
 */
export function matchPlainDate<T extends ObjectLiteral> (
  column: string,
  filter: PlainDateFilter | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined) {
    return undefined
  }

  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    const operation = filter.operation
    switch (operation) {
      case PlainDateOperation.IS:
        qb.setParameter(paramName, filter.value)
        return `${column} = :${paramName}`
      case PlainDateOperation.IS_NOT:
        qb.setParameter(paramName, filter.value)
        return `${column} != :${paramName}`
      case PlainDateOperation.BEFORE:
        qb.setParameter(paramName, filter.value)
        return `${column} < :${paramName}`
      case PlainDateOperation.SAME_OR_BEFORE:
        qb.setParameter(paramName, filter.value)
        return `${column} <= :${paramName}`
      case PlainDateOperation.AFTER:
        qb.setParameter(paramName, filter.value)
        return `${column} > :${paramName}`
      case PlainDateOperation.SAME_OR_AFTER:
        qb.setParameter(paramName, filter.value)
        return `${column} >= :${paramName}`
      case PlainDateOperation.CONTAINED_IN:
        qb.setParameter(paramName, filter.value.parse().toString())
        return `${column} <@ :${paramName}::daterange`
      case PlainDateOperation.NOT_CONTAINED_IN:
        qb.setParameter(paramName, filter.value.parse().toString())
        return `NOT (${column} <@ :${paramName}::daterange)`
      default:
        return exhaustiveCheck(operation)
    }
  }
}
