import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Column, ColumnOptions } from 'typeorm'

export enum CustomFieldType {
  TEXT = 'text',
  TEXT_ARRAY = 'text_array',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  TIMESTAMP = 'timestamp',
  DATE = 'date',
  SINGLE_SELECT = 'single_select',
  MULTI_SELECT = 'multi_select',
  MONETARY = 'monetary'
}

export function CustomFieldTypeColumn (
  options?: Omit<ColumnOptions, 'type' | 'enum' | 'enumName'>
): PropertyDecorator {
  return Column({
    ...options,
    type: 'varchar'
  })
}

export function CustomFieldTypeApiProperty (
  options?: ApiPropertyOptions
): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: CustomFieldType,
    enumName: 'CustomFieldType'
  })
}
