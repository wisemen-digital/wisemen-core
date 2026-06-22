import { buildConditionalFilter, ConditionalFilter } from '#src/conditional-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { ApiProperty } from '@nestjs/swagger'
import { DateTimeRange, DateTimeRangeDto, IsDateTimeRange } from '@wisemen/datewise'

export const DateTimeRangeFilter = buildConditionalFilter<RangeFilterCondition, DateTimeRange | DateTimeRangeDto>(
  'DateTimeRangeFilter',
  RangeFilterCondition,
  'RangeFilterCondition',
  ApiProperty({ type: DateTimeRangeDto }),
  IsDateTimeRange()
)

export type DateTimeRangeFilter = ConditionalFilter<RangeFilterCondition, DateTimeRange | DateTimeRangeDto>
