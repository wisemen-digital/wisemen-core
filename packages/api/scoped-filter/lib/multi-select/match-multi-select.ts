import { MultiSelectOperation } from '#src/multi-select/multi-select-operation.js'
import { MultiSelectFilter } from '#src/multi-select/multi-select-filter.js'
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
export function MatchMultiSelect<T> (
    filter: MultiSelectFilter<T> | undefined
): FindOperator<T> | undefined {
  if (filter === undefined) {
    return undefined
  } else if (filter.operation === MultiSelectOperation.INCLUDE) {
    return Any(filter.values)
  } else if (filter.operation === MultiSelectOperation.EXCLUDE) {
    return Not(Any(filter.values))
  }
}
