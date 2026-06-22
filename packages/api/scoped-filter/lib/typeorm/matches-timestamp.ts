import { DateFilterCondition } from '#src/date-filter-condition.js'
import { TimestampFilter } from '#src/timestamp-filter.js'
import { timestamp, Timestamp } from '@wisemen/datewise'
import { FindOperator } from 'typeorm'
import { binaryRawCondition } from '#src/typeorm/helpers.js'

export function MatchesTimestamp (
  filter: TimestampFilter | undefined
): FindOperator<Timestamp | Date> | undefined {
  if (filter === undefined) {
    return undefined
  }

  const value = timestamp(filter.value).toISOString()

  switch (filter.condition) {
    case DateFilterCondition.EQUAL:
      return binaryRawCondition<Timestamp | Date>('=', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.NOT_EQUAL:
      return binaryRawCondition<Timestamp | Date>('!=', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.BEFORE:
      return binaryRawCondition<Timestamp | Date>('<', value, { cast: 'timestamptz(3)' })
    case DateFilterCondition.AFTER:
      return binaryRawCondition<Timestamp | Date>('>', value, { cast: 'timestamptz(3)' })
  }
}
