import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { NumberFilter } from '#src/number/number-filter.js'
import { NumberOperation } from '#src/number/number-operation.js'
import { Equal, FindOperator, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm'

/**
 * Checks if the column matches number filter.
 * 
 * Uses basic typeorm number comparison operators. \
 *
 * `null` and `undefined` match all values
 * 
 * @param filter the scope to match.
 * @example repo.findOneBy({count: MatchNumber(query.filter.count)})
 */
export function MatchNumber (filter: NumberFilter | undefined | null): FindOperator<number> | undefined {
  if (filter === undefined || filter === null) {
    return undefined
  }

  switch(filter.operation) {
    case NumberOperation.EQUALS: return Equal(filter.value)
    case NumberOperation.LESS_THAN: return LessThan(filter.value)
    case NumberOperation.LESS_THAN_OR_EQUAL: return LessThanOrEqual(filter.value)
    case NumberOperation.MORE_THAN: return MoreThan(filter.value)
    case NumberOperation.MORE_THAN_OR_EQUAL: return MoreThanOrEqual(filter.value)
    case NumberOperation.NOT_EQUALS: return Not(Equal(filter.value))
    default: 
    return exhaustiveCheck(filter.operation)
  } 
}
