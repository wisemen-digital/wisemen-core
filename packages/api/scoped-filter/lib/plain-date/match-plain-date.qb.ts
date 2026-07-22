import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { PlainDateFilter } from '#src/plain-date/plain-date-filter.js'
import { PlainDateOperation } from '#src/plain-date/plain-date-operation.js'
import { ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm'

declare module 'typeorm' {
  interface QueryBuilder<Entity extends ObjectLiteral> {
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.whereMatchPlainDate('invoice.date', query.filter.date)
     */
    whereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.andWhereMatchPlainDate('invoice.date', query.filter.date)
     */
    andWhereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.orWhereMatchPlainDate('invoice.date', query.filter.date)
     */
    orWhereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
  }

  interface WhereExpressionBuilder {
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.whereMatchPlainDate('invoice.date', query.filter.date)
     */
    whereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.andWhereMatchPlainDate('invoice.date', query.filter.date)
     */
    andWhereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
    /**
     * Checks if the column matches a plain date filter.
     * Best used for query builders.
     *
     * @param column the name of the column to match on.
     * @param filter the filter to match.
     * @example qb.orWhereMatchPlainDate('invoice.date', query.filter.date)
     */
    orWhereMatchPlainDate (column: string, filter: PlainDateFilter | null | undefined): this
  }
}

type PlainDateQueryBuilderExtensions = QueryBuilder<ObjectLiteral> & {
  whereMatchPlainDate: (column: string, filter: PlainDateFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  andWhereMatchPlainDate: (column: string, filter: PlainDateFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  orWhereMatchPlainDate: (column: string, filter: PlainDateFilter | null | undefined) => QueryBuilder<ObjectLiteral>
}

const queryBuilderPrototype = QueryBuilder.prototype as PlainDateQueryBuilderExtensions

queryBuilderPrototype.whereMatchPlainDate = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: PlainDateFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.where(matchPlainDate(column, filter)!)
}

queryBuilderPrototype.andWhereMatchPlainDate = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: PlainDateFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.andWhere(matchPlainDate(column, filter)!)
}

queryBuilderPrototype.orWhereMatchPlainDate = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: PlainDateFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.orWhere(matchPlainDate(column, filter)!)
}

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
  filter: PlainDateFilter | null | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined || filter === null) {
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
