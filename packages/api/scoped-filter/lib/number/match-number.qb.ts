import { randomUUID } from 'crypto'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { NumberFilter } from '#src/number/number-filter.js'
import { NumberOperation } from '#src/number/number-operation.js'
import { ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm'

declare module 'typeorm' {
  interface QueryBuilder<Entity extends ObjectLiteral> {
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.whereMatchNumber('invoice.amount', query.filter.amount)
     */
    whereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.andWhereMatchNumber('invoice.amount', query.filter.amount)
     */
    andWhereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.orWhereMatchNumber('invoice.amount', query.filter.amount)
     */
    orWhereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
  }

  interface WhereExpressionBuilder {
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.whereMatchNumber('invoice.amount', query.filter.amount)
     */
    whereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.andWhereMatchNumber('invoice.amount', query.filter.amount)
     */
    andWhereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
    /**
     * Checks if the column matches a number filter.
     * Best used for query builders.
     *
     * Uses basic SQL number comparison operators.
     *
     * @param column the name of the column to match on.
     * @param filter the number filter to match.
     *
     * @example qb.orWhereMatchNumber('invoice.amount', query.filter.amount)
     */
    orWhereMatchNumber (column: string, filter: NumberFilter | null | undefined): this
  }
}

type NumberQueryBuilderExtensions = QueryBuilder<ObjectLiteral> & {
  whereMatchNumber: (column: string, filter: NumberFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  andWhereMatchNumber: (column: string, filter: NumberFilter | null | undefined) => QueryBuilder<ObjectLiteral>
  orWhereMatchNumber: (column: string, filter: NumberFilter | null | undefined) => QueryBuilder<ObjectLiteral>
}

const queryBuilderPrototype = QueryBuilder.prototype as NumberQueryBuilderExtensions

queryBuilderPrototype.whereMatchNumber = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: NumberFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.where(matchNumber(column, filter)!)
}

queryBuilderPrototype.andWhereMatchNumber = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: NumberFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.andWhere(matchNumber(column, filter)!)
}

queryBuilderPrototype.orWhereMatchNumber = function (
  this: SelectQueryBuilder<ObjectLiteral>,
  column: string,
  filter: NumberFilter | undefined | null
): SelectQueryBuilder<ObjectLiteral> {
  if (filter === null || filter === undefined) {
    return this
  }

  return this.orWhere(matchNumber(column, filter)!)
}

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
  filter: NumberFilter | null | undefined
): ((qb: SelectQueryBuilder<T>) => string) | undefined {
  if (filter === undefined || filter === null) {
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
