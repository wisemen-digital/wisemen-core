import { buildConditionalFilter, ConditionalFilter } from '#src/conditional-filter.js'
import { DateFilterCondition } from '#src/date-filter-condition.js'
import { IsTimestamp, TimestampApiProperty } from '@wisemen/datewise'

export const TimestampFilter = buildConditionalFilter<DateFilterCondition, string>(
  'TimestampFilter',
  DateFilterCondition,
  'DateFilterCondition',
  TimestampApiProperty(),
  IsTimestamp()
)

export type TimestampFilter = ConditionalFilter<DateFilterCondition, string>
