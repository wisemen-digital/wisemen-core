import { Scope } from "#src/scope.js"
import { ScopedFilter } from "#src/scoped-filter.js"
import { randomUUID } from "crypto"
import { ObjectLiteral, SelectQueryBuilder } from "typeorm"

/**  
 * Checks if the column matches any of the requested scoped values.
 * Best used for query builders.
 * 
 * Uses `column = ANY(...)` for inclusive scope. \
 * Uses `column != ALL(...)` for exclusive scope.
 * 
 * @param column the name of the column to match on.
 * @param filter the scoped filter to match.
 * 
 * @example qb.where(matches("user.uuid", query.filter.uuid))
 */
export function matches<T extends ObjectLiteral, V> (
  column: string,
  filter: ScopedFilter<V>
): (qb: SelectQueryBuilder<T>) => string {
  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    qb.setParameter(paramName, filter.values)

    if (filter.scope === Scope.INCLUDE) {
      return `${column} = ANY(:${paramName})`
    } else if (filter.scope === Scope.EXCLUDE) {
      return `${column} != ALL(:${paramName})`
    } else {
      throw new Error(`unexpected scope ${filter.scope as unknown as string}`)
    }
  }
}

