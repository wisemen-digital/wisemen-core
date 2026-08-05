import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { TimestampFilter } from '#src/timestamp/timestamp-filter.js'
import { TimestampOperation } from '#src/timestamp/timestamp-operation.js'
import { ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm'

declare module 'typeorm' {
  interface QueryBuilder<Entity extends ObjectLiteral> {
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.whereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    whereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.andWhereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    andWhereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.orWhereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    orWhereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
  }

  interface WhereExpressionBuilder {
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.whereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    whereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.andWhereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    andWhereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
    /**
     * Checks if the column matches a timestamp filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.orWhereMatchTimestamp('invoice.timestamp', query.filter.timestamp)
     */
    orWhereMatchTimestamp (column: string, filter: TimestampFilter | null | undefined): this
  }
}

type TimestampQueryBuilderExtensions = QueryBuilder<ObjectLiteral> & {
  whereMatchTimestamp: (column: string, filter: TimestampFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  andWhereMatchTimestamp: (column: string, filter: TimestampFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  orWhereMatchTimestamp: (column: string, filter: TimestampFilter | null | undefined) => QueryBuilder<ObjectLiteral>
}

const queryBuilderPrototype = QueryBuilder.prototype as TimestampQueryBuilderExtensions

queryBuilderPrototype.whereMatchTimestamp = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: TimestampFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.where(matchTimestamp(column, filter)!)
}

queryBuilderPrototype.andWhereMatchTimestamp = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: TimestampFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.andWhere(matchTimestamp(column, filter)!)
}

queryBuilderPrototype.orWhereMatchTimestamp = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: TimestampFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.orWhere(matchTimestamp(column, filter)!)
}

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
  filter: TimestampFilter | null | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined || filter === null) {
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
