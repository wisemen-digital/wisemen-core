import { ApiExtraModels, ApiProperty, type ApiPropertyOptions, getSchemaPath } from '@nestjs/swagger'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { CustomFieldValueDto } from './base-custom-field-value.dto.js'
import { BooleanCustomFieldValueDto } from '#src/custom-field-types/boolean/boolean.dto.js'
import { DateCustomFieldValueDto } from '#src/custom-field-types/date/date.dto.js'
import { MonetaryCustomFieldValueDto } from '#src/custom-field-types/monetary/monetary.dto.js'
import { MultiSelectCustomFieldValueDto } from '#src/custom-field-types/multi-select/multi-select.dto.js'
import { NumberCustomFieldValueDto } from '#src/custom-field-types/number/number.dto.js'
import { SingleSelectCustomFieldValueDto } from '#src/custom-field-types/single-select/single-select.dto.js'
import { TextArrayCustomFieldValueDto } from '#src/custom-field-types/text-array/text-array.dto.js'
import { TextCustomFieldValueDto } from '#src/custom-field-types/text/text.dto.js'
import { DateTimeCustomFieldValueDto } from '#src/custom-field-types/timestamp/timestamp.dto.js'
import type { CustomFieldValue } from '#src/custom-field-value.js'

CustomFieldValueDto.registerFromCustomFieldValue((customFieldValue: CustomFieldValue): CustomFieldValueDto => {
  switch (customFieldValue.type) {
    case CustomFieldType.TEXT:
      return TextCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.TEXT_ARRAY:
      return TextArrayCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.NUMBER:
      return NumberCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.BOOLEAN:
      return BooleanCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.DATE:
      return DateCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.TIMESTAMP:
      return DateTimeCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.SINGLE_SELECT:
      return SingleSelectCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.MULTI_SELECT:
      return MultiSelectCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    case CustomFieldType.MONETARY:
      return MonetaryCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
    default:
      return exhaustiveCheck(customFieldValue)
  }
})

export { CustomFieldValueDto }
export {
  BooleanCustomFieldValueDto,
  DateCustomFieldValueDto,
  DateTimeCustomFieldValueDto,
  MonetaryCustomFieldValueDto,
  MultiSelectCustomFieldValueDto,
  NumberCustomFieldValueDto,
  SingleSelectCustomFieldValueDto,
  TextArrayCustomFieldValueDto,
  TextCustomFieldValueDto
}

export const CUSTOM_FIELD_VALUE_DTOS = [
  TextCustomFieldValueDto,
  TextArrayCustomFieldValueDto,
  NumberCustomFieldValueDto,
  BooleanCustomFieldValueDto,
  DateCustomFieldValueDto,
  DateTimeCustomFieldValueDto,
  SingleSelectCustomFieldValueDto,
  MultiSelectCustomFieldValueDto,
  MonetaryCustomFieldValueDto
] as const

function getCustomFieldValueDtoSchemaPathMapping(): Record<CustomFieldType, string> {
  return {
    [CustomFieldType.TEXT]: getSchemaPath(TextCustomFieldValueDto),
    [CustomFieldType.TEXT_ARRAY]: getSchemaPath(TextArrayCustomFieldValueDto),
    [CustomFieldType.NUMBER]: getSchemaPath(NumberCustomFieldValueDto),
    [CustomFieldType.BOOLEAN]: getSchemaPath(BooleanCustomFieldValueDto),
    [CustomFieldType.DATE]: getSchemaPath(DateCustomFieldValueDto),
    [CustomFieldType.TIMESTAMP]: getSchemaPath(DateTimeCustomFieldValueDto),
    [CustomFieldType.SINGLE_SELECT]: getSchemaPath(SingleSelectCustomFieldValueDto),
    [CustomFieldType.MULTI_SELECT]: getSchemaPath(MultiSelectCustomFieldValueDto),
    [CustomFieldType.MONETARY]: getSchemaPath(MonetaryCustomFieldValueDto)
  }
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
