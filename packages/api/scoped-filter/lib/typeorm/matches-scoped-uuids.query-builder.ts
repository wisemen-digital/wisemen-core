import { Scope } from "#src/scope.js"
import { ScopedUuidFilter } from "#src/scoped-uuid-filter.js"
import { randomUUID } from "crypto"
import { ObjectLiteral, SelectQueryBuilder } from "typeorm"

/**  
 * Checks if the uuid matches any of the requested scoped uuids.
 * Best used for query builders.
 * 
 * Uses `column = ANY(...)` for inclusive scope. \
 * Uses `column != ALL(...)` for exclusive scope.
 * 
 * @param column the name of the column to match on.
 * @param filter the scoped filter to match.
 * 
 * @example qb.where(matchesScopedUuids("user.uuid", query.filter.uuid))
 */
export function matchesScopedUuids<T extends ObjectLiteral, Uuid extends string> (
  column: string,
  filter: ScopedUuidFilter<Uuid>
): (qb: SelectQueryBuilder<T>) => string {
  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    qb.setParameter(paramName, filter.uuids)

    if (filter.scope === Scope.INCLUDE) {
      return `${column} = ANY(:${paramName})`
    } else if (filter.scope === Scope.EXCLUDE) {
      return `${column} != ALL(:${paramName})`
    } else {
      throw new Error(`unexpected scope ${filter.scope as unknown as string}`)
    }
  }
}

