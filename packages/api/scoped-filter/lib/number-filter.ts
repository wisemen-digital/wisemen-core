import { buildConditionalFilter, ConditionalFilter } from '#src/conditional-filter.js'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { NumberFilterCondition } from '#src/number-filter-condition.js'

export const NumberFilter = buildConditionalFilter<NumberFilterCondition, number>(
  'NumberFilter',
  NumberFilterCondition,
  'NumberFilterCondition',
  ApiProperty({ type: Number }),
  IsNumber()
)

export type NumberFilter = ConditionalFilter<NumberFilterCondition, number>
