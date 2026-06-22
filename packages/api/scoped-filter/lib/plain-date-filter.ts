import { buildConditionalFilter, ConditionalFilter } from '#src/conditional-filter.js'
import { DateFilterCondition } from '#src/date-filter-condition.js'
import { IsPlainDate, PlainDateApiProperty } from '@wisemen/datewise'

export const PlainDateFilter = buildConditionalFilter<DateFilterCondition, string>(
  'PlainDateFilter',
  DateFilterCondition,
  'DateFilterCondition',
  PlainDateApiProperty(),
  IsPlainDate()
)

export type PlainDateFilter = ConditionalFilter<DateFilterCondition, string>
