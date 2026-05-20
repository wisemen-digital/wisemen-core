import { Scope } from '#src/scope.js'
import { ScopedUuidFilter } from '#src/scoped-uuid-filter.js'
import { Any, FindOperator, Not } from 'typeorm'

/**  
 * Checks if the uuid matches any of the requested scoped uuids.
 * 
 * Uses `column = ANY(...)` for inclusive scope. \
 * Uses `NOT(column = ANY(...))` for exclusive scope.
 * 
 * @param filter the scope to match.
 * @example repo.findOneBy({uuid: MatchesScopeUuids(query.filter.uuid)})
 */
export function MatchesScopedUuids<T extends string> (
    filter: ScopedUuidFilter<T> | undefined
): FindOperator<T> | undefined {
  if (filter === undefined) {
    return undefined
  } else if (filter.scope === Scope.INCLUDE) {
    return Any(filter.uuids)
  } else if (filter.scope === Scope.EXCLUDE) {
    return Not(Any(filter.uuids))
  }
}
