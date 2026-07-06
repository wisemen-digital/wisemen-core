import { BooleanCustomFieldValueDto, CUSTOM_FIELD_VALUE_DTOS, CustomFieldValueDto, DateCustomFieldValueDto, DateTimeCustomFieldValueDto, MonetaryCustomFieldValueDto, MultiSelectCustomFieldValueDto, NumberCustomFieldValueDto, SingleSelectCustomFieldValueDto, TextArrayCustomFieldValueDto, TextCustomFieldValueDto } from '#src/dto/custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { ArrayUnique, IsArray, ValidateNested } from 'class-validator'

type CustomFieldValueDtoClass = typeof CUSTOM_FIELD_VALUE_DTOS[number]
function getCustomFieldValueDtoDiscriminatorSubTypes(): Array<{ name: CustomFieldType, value: CustomFieldValueDtoClass }> {
  return [
    { name: CustomFieldType.TEXT, value: TextCustomFieldValueDto },
    { name: CustomFieldType.TEXT_ARRAY, value: TextArrayCustomFieldValueDto },
    { name: CustomFieldType.NUMBER, value: NumberCustomFieldValueDto },
    { name: CustomFieldType.BOOLEAN, value: BooleanCustomFieldValueDto },
    { name: CustomFieldType.DATE, value: DateCustomFieldValueDto },
    { name: CustomFieldType.TIMESTAMP, value: DateTimeCustomFieldValueDto },
    { name: CustomFieldType.SINGLE_SELECT, value: SingleSelectCustomFieldValueDto },
    { name: CustomFieldType.MULTI_SELECT, value: MultiSelectCustomFieldValueDto },
    { name: CustomFieldType.MONETARY, value: MonetaryCustomFieldValueDto }
  ]
}

export function IsCustomFields(): PropertyDecorator {
  return applyDecorators(
    IsArray(),
    ArrayUnique((customField: CustomFieldValueDto) => customField.definitionUuid),
    ValidateNested({ each: true }),
    Type(() => CustomFieldValueDto, {
      discriminator: {
        property: 'type',
        subTypes: getCustomFieldValueDtoDiscriminatorSubTypes()
      },
      keepDiscriminatorProperty: true
    })
  )
}
