import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { TimestampFilter } from '#src/timestamp/timestamp-filter.js'
import { TimestampOperation } from '#src/timestamp/timestamp-operation.js'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

/**
 * Checks if the column matches a timestamp filter.
 * Best used for query builders.
 *
 * @param column the name of the column to match on.
 * @param filter the filter to match.
 * @example qb.where(matchTimestamp('invoice.timestamp', query.filter.timestamp))
 */
export function matchTimestamp<T extends ObjectLiteral> (
  column: string,
  filter: TimestampFilter | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined) {
    return undefined
  }

  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    const operation = filter.operation

    switch (operation) {
      case TimestampOperation.IS:
        qb.setParameter(paramName, filter.value)
        return `${column} = :${paramName}`
      case TimestampOperation.IS_NOT:
        qb.setParameter(paramName, filter.value)
        return `${column} != :${paramName}`
      case TimestampOperation.BEFORE:
        qb.setParameter(paramName, filter.value)
        return `${column} < :${paramName}`
      case TimestampOperation.SAME_OR_BEFORE:
        qb.setParameter(paramName, filter.value)
        return `${column} <= :${paramName}`
      case TimestampOperation.AFTER:
        qb.setParameter(paramName, filter.value)
        return `${column} > :${paramName}`
      case TimestampOperation.SAME_OR_AFTER:
        qb.setParameter(paramName, filter.value)
        return `${column} >= :${paramName}`
      case TimestampOperation.CONTAINED_IN:
        qb.setParameter(paramName, filter.value.parse().toString())
        return `${column} <@ :${paramName}::tstzrange3`
      case TimestampOperation.NOT_CONTAINED_IN:
        qb.setParameter(paramName, filter.value.parse().toString())
        return `NOT (${column} <@ :${paramName}::tstzrange3)`
      default:
        return exhaustiveCheck(operation)
    }
  }
}
