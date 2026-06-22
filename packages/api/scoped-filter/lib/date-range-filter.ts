import { buildConditionalFilter, ConditionalFilter } from '#src/conditional-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { ApiProperty } from '@nestjs/swagger'
import { DateRange, DateRangeDto, IsDateRange } from '@wisemen/datewise'

export const DateRangeFilter = buildConditionalFilter<RangeFilterCondition, DateRange | DateRangeDto>(
  'DateRangeFilter',
  RangeFilterCondition,
  'RangeFilterCondition',
  ApiProperty({ type: DateRangeDto }),
  IsDateRange()
)

export type DateRangeFilter = ConditionalFilter<RangeFilterCondition, DateRange | DateRangeDto>
