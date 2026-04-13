import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'
import { ColumnOptions, Column } from 'typeorm'

export enum RRuleFrequency {
  DAILY = 'day',
  WEEKLY = 'week',
  MONTHLY = 'month',
  YEARLY = 'year'
}

export function RRuleFrequencyApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: RRuleFrequency,
    enumName: 'RRuleFrequency'
  })
}

type RRuleFrequencyColumnOptions = Omit<ColumnOptions, 'type' | 'enum' | 'enumName'>
export function RRuleFrequencyColumn (
  options?: RRuleFrequencyColumnOptions
): PropertyDecorator {
  return Column({
    ...options,
    type: 'enum',
    enum: RRuleFrequency,
    enumName: 'rrule_frequency'
  })
}
