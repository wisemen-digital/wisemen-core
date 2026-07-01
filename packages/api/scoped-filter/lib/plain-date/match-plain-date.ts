import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { PlainDateFilter } from '#src/plain-date/plain-date-filter.js'
import { PlainDateOperation } from '#src/plain-date/plain-date-operation.js'
import { ContainedIn, plainDate, PlainDate } from '@wisemen/datewise'
import { Equal, FindOperator, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm'

/**  
 * Checks if the column matches a plain date filter.
 * 
 * @param filter the filter to match.
 * @example repo.findOneBy({date: MatchPlainDate(query.filter.date)})
 */
export function MatchPlainDate (filter: PlainDateFilter | undefined): FindOperator<PlainDate> | undefined {
  if (filter === undefined) {
    return undefined
  }

  const operation = filter.operation
  switch(operation) {
    case PlainDateOperation.IS: return Equal(plainDate(filter.value))
    case PlainDateOperation.IS_NOT: return Not(Equal(plainDate(filter.value)))
    case PlainDateOperation.BEFORE: return LessThan(plainDate(filter.value))
    case PlainDateOperation.SAME_OR_BEFORE: return LessThanOrEqual(plainDate(filter.value))
    case PlainDateOperation.AFTER: return MoreThan(plainDate(filter.value))
    case PlainDateOperation.SAME_OR_AFTER: return MoreThanOrEqual(plainDate(filter.value))
    case PlainDateOperation.CONTAINED_IN: return ContainedIn(filter.value.parse())
    case PlainDateOperation.NOT_CONTAINED_IN: return Not(ContainedIn(filter.value.parse()))
    default: 
    return exhaustiveCheck(operation)
  } 
}
