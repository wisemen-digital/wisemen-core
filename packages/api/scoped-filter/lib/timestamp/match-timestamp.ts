import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { TimestampFilter } from '#src/timestamp/timestamp-filter.js'
import { TimestampOperation } from '#src/timestamp/timestamp-operation.js'
import { ContainedIn, timestamp, Timestamp } from '@wisemen/datewise'
import { Equal, FindOperator, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm'

/**
 * Checks if the column matches a timestamp filter.
 *
 * `null` and `undefined` match all values
 *
 * @param filter the filter to match.
 * @example repo.findOneBy({ timestamp: MatchTimestamp(query.filter.timestamp) })
 */
export function MatchTimestamp (filter: TimestampFilter | undefined | null): FindOperator<Timestamp> | undefined {
  if (filter === undefined || filter === null) {
    return undefined
  }

  const operation = filter.operation
  switch (operation) {
    case TimestampOperation.IS: return Equal(timestamp(filter.value))
    case TimestampOperation.IS_NOT: return Not(Equal(timestamp(filter.value)))
    case TimestampOperation.BEFORE: return LessThan(timestamp(filter.value))
    case TimestampOperation.SAME_OR_BEFORE: return LessThanOrEqual(timestamp(filter.value))
    case TimestampOperation.AFTER: return MoreThan(timestamp(filter.value))
    case TimestampOperation.SAME_OR_AFTER: return MoreThanOrEqual(timestamp(filter.value))
    case TimestampOperation.CONTAINED_IN: return ContainedIn<Timestamp>(filter.value.parse())
    case TimestampOperation.NOT_CONTAINED_IN: return Not(ContainedIn<Timestamp>(filter.value.parse()))
    default:
      return exhaustiveCheck(operation)
  }
}
