import { MultiSelectOperation } from '#src/multi-select/multi-select-operation.js'
import { MultiSelectFilter } from '#src/multi-select/multi-select-filter.js'
import { Any, FindOperator, Not, Raw } from 'typeorm'

/**  
 * Checks if the column matches any of the requested scoped values.
 * 
 * Uses `column = ANY(...)` for inclusive scope. \
 * Uses `NOT(column = ANY(...))` for exclusive scope.
 * 
 * `null` and `undefined` match all values
 * 
 * @param filter the scope to match.
 * @example repo.findOneBy({uuid: Matches(query.filter.uuid)})
 */
export function MatchMultiSelect<T> (
    filter: MultiSelectFilter<T> | undefined | null
): FindOperator<T> | undefined {
  if (filter === undefined || filter === null) {
    return undefined
  } else if (filter.operation === MultiSelectOperation.INCLUDE) {
    return filter.values.length === 0
      ? Raw(() => 'FALSE')
      : Any(filter.values)
  } else if (filter.operation === MultiSelectOperation.EXCLUDE) {
    return filter.values.length === 0
      ? Raw(() => 'TRUE')
      : Not(Any(filter.values))
  }
}
