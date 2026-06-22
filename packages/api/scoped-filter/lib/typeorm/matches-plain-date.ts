import { DateFilterCondition } from '#src/date-filter-condition.js'
import { PlainDateFilter } from '#src/plain-date-filter.js'
import { plainDate, PlainDate } from '@wisemen/datewise'
import { FindOperator } from 'typeorm'
import { binaryRawCondition } from '#src/typeorm/helpers.js'

export function MatchesPlainDate (
  filter: PlainDateFilter | undefined
): FindOperator<PlainDate> | undefined {
  if (filter === undefined) {
    return undefined
  }

  const value = plainDate(filter.value).toString()

  switch (filter.condition) {
    case DateFilterCondition.EQUAL:
      return binaryRawCondition<PlainDate>('=', value, { cast: 'date' })
    case DateFilterCondition.NOT_EQUAL:
      return binaryRawCondition<PlainDate>('!=', value, { cast: 'date' })
    case DateFilterCondition.BEFORE:
      return binaryRawCondition<PlainDate>('<', value, { cast: 'date' })
    case DateFilterCondition.AFTER:
      return binaryRawCondition<PlainDate>('>', value, { cast: 'date' })
  }
}
