import { Scope } from '#src/scope.js'
import { ScopedFilter } from '#src/scoped-filter.js'
import { Any, FindOperator, Not } from 'typeorm'

/**  
 * Checks if the column matches any of the requested scoped values.
 * 
 * Uses `column = ANY(...)` for inclusive scope. \
 * Uses `NOT(column = ANY(...))` for exclusive scope.
 * 
 * @param filter the scope to match.
 * @example repo.findOneBy({uuid: Matches(query.filter.uuid)})
 */
export function Matches<T > (
    filter: ScopedFilter<T> | undefined
): FindOperator<T> | undefined {
  if (filter === undefined) {
    return undefined
  } else if (filter.scope === Scope.INCLUDE) {
    return Any(filter.values)
  } else if (filter.scope === Scope.EXCLUDE) {
    return Not(Any(filter.values))
  }
}
