import { exhaustiveCheck } from "#src/exhaustive-check.js"
import { MultiSelectFilter } from "#src/multi-select/multi-select-filter.js"
import { MultiSelectOperation } from "#src/multi-select/multi-select-operation.js"
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
export function matchMultiSelect<T extends ObjectLiteral, V> (
  column: string,
  filter: MultiSelectFilter<V>
): (qb: SelectQueryBuilder<T>) => string {
  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    qb.setParameter(paramName, filter.values)

    if (filter.operation === MultiSelectOperation.INCLUDE) {
      return `${column} = ANY(:${paramName})`
    } else if (filter.operation === MultiSelectOperation.EXCLUDE) {
      return `${column} != ALL(:${paramName})`
    } else {
      return exhaustiveCheck(filter.operation)
    }
  }
}

