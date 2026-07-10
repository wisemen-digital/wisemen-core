import { ApiExtraModels, ApiProperty, type ApiPropertyOptions, getSchemaPath } from '@nestjs/swagger'
import type { BooleanCustomFieldValue, DateCustomFieldValue, MonetaryCustomFieldValue, MultiSelectCustomFieldValue, NumberCustomFieldValue, SingleSelectCustomFieldValue, TextArrayCustomFieldValue, TextCustomFieldValue, TimestampCustomFieldValue } from '#src/custom-field-types/index.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { CustomFieldValue } from '#src/custom-field-value.js'
import { BooleanCustomFieldValueDto } from '#src/custom-field-types/boolean/boolean.dto.js'
import { DateCustomFieldValueDto } from '#src/custom-field-types/date/date.dto.js'
import { MonetaryCustomFieldValueDto } from '#src/custom-field-types/monetary/monetary.dto.js'
import { MultiSelectCustomFieldValueDto } from '#src/custom-field-types/multi-select/multi-select.dto.js'
import { NumberCustomFieldValueDto } from '#src/custom-field-types/number/number.dto.js'
import { SingleSelectCustomFieldValueDto } from '#src/custom-field-types/single-select/single-select.dto.js'
import { TextArrayCustomFieldValueDto } from '#src/custom-field-types/text-array/text-array.dto.js'
import { TextCustomFieldValueDto } from '#src/custom-field-types/text/text.dto.js'
import { TimestampCustomFieldValueDto } from '#src/custom-field-types/timestamp/timestamp.dto.js'
import { BaseCustomFieldValueDto } from './base-custom-field-value.dto.js'

export type CustomFieldValueDtoClass = new () => BaseCustomFieldValueDto

export abstract class CustomFieldValueDto extends BaseCustomFieldValueDto {
  static from(customFieldValue: TextCustomFieldValue): TextCustomFieldValueDto
  static from(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto
  static from(customFieldValue: NumberCustomFieldValue): NumberCustomFieldValueDto
  static from(customFieldValue: BooleanCustomFieldValue): BooleanCustomFieldValueDto
  static from(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto
  static from(customFieldValue: TimestampCustomFieldValue): TimestampCustomFieldValueDto
  static from(customFieldValue: SingleSelectCustomFieldValue): SingleSelectCustomFieldValueDto
  static from(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto
  static from(customFieldValue: MonetaryCustomFieldValue): MonetaryCustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): BaseCustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): BaseCustomFieldValueDto {
    switch (customFieldValue.type) {
      case CustomFieldType.TEXT:
        return TextCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.TEXT_ARRAY:
        return TextArrayCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.NUMBER:
        return NumberCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.BOOLEAN:
        return BooleanCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.DATE:
        return DateCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.TIMESTAMP:
        return TimestampCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.SINGLE_SELECT:
        return SingleSelectCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.MULTI_SELECT:
        return MultiSelectCustomFieldValueDto.from(customFieldValue)
      case CustomFieldType.MONETARY:
        return MonetaryCustomFieldValueDto.from(customFieldValue)
      default:
        return exhaustiveCheck(customFieldValue)
    }
  }
}

export {
  BooleanCustomFieldValueDto,
  DateCustomFieldValueDto,
  TimestampCustomFieldValueDto,
  MonetaryCustomFieldValueDto,
  MultiSelectCustomFieldValueDto,
  NumberCustomFieldValueDto,
  SingleSelectCustomFieldValueDto,
  TextArrayCustomFieldValueDto,
  TextCustomFieldValueDto
}

export const CUSTOM_FIELD_VALUE_DTO_BY_TYPE = {
  [CustomFieldType.TEXT]: TextCustomFieldValueDto,
  [CustomFieldType.TEXT_ARRAY]: TextArrayCustomFieldValueDto,
  [CustomFieldType.NUMBER]: NumberCustomFieldValueDto,
  [CustomFieldType.BOOLEAN]: BooleanCustomFieldValueDto,
  [CustomFieldType.DATE]: DateCustomFieldValueDto,
  [CustomFieldType.TIMESTAMP]: TimestampCustomFieldValueDto,
  [CustomFieldType.SINGLE_SELECT]: SingleSelectCustomFieldValueDto,
  [CustomFieldType.MULTI_SELECT]: MultiSelectCustomFieldValueDto,
  [CustomFieldType.MONETARY]: MonetaryCustomFieldValueDto
} satisfies Record<CustomFieldType, CustomFieldValueDtoClass>

export const CUSTOM_FIELD_VALUE_DTOS = Object.values(CUSTOM_FIELD_VALUE_DTO_BY_TYPE)

function getCustomFieldValueDtoSchemaPathMapping(): Record<CustomFieldType, string> {
  return Object.fromEntries(
    Object.entries(CUSTOM_FIELD_VALUE_DTO_BY_TYPE).map(([type, dto]) => [type, getSchemaPath(dto)])
  ) as Record<CustomFieldType, string>
}

export function getCustomFieldValueDtoDiscriminatorSubTypes(): Array<{ name: CustomFieldType, value: CustomFieldValueDtoClass }> {
  return Object.entries(CUSTOM_FIELD_VALUE_DTO_BY_TYPE).map(
    ([name, value]) => ({ name: name as CustomFieldType, value })
  )
}

export function CustomFieldValueApiExtraModels(): ClassDecorator {
  return ApiExtraModels(...CUSTOM_FIELD_VALUE_DTOS)
}

export function CustomFieldValueDtoApiProperty(options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: CUSTOM_FIELD_VALUE_DTOS.map(dto => ({ $ref: getSchemaPath(dto) })),
    discriminator: {
      propertyName: 'type',
      mapping: getCustomFieldValueDtoSchemaPathMapping()
    }
  })
}
