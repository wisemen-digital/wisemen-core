import { BooleanCustomFieldValueDto, CUSTOM_FIELD_VALUE_DTOS, CustomFieldValueDto, DateCustomFieldValueDto, DateTimeCustomFieldValueDto, MonetaryCustomFieldValueDto, MultiSelectCustomFieldValueDto, NumberCustomFieldValueDto, SingleSelectCustomFieldValueDto, TextArrayCustomFieldValueDto, TextCustomFieldValueDto } from '#src/dto/custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { ArrayUnique, IsArray, ValidateNested } from 'class-validator'

type CustomFieldValueDtoClass = typeof CUSTOM_FIELD_VALUE_DTOS[number]
const CUSTOM_FIELD_VALUE_DTO_BY_TYPE = {
  [CustomFieldType.TEXT]: TextCustomFieldValueDto,
  [CustomFieldType.TEXT_ARRAY]: TextArrayCustomFieldValueDto,
  [CustomFieldType.NUMBER]: NumberCustomFieldValueDto,
  [CustomFieldType.BOOLEAN]: BooleanCustomFieldValueDto,
  [CustomFieldType.DATE]: DateCustomFieldValueDto,
  [CustomFieldType.TIMESTAMP]: DateTimeCustomFieldValueDto,
  [CustomFieldType.SINGLE_SELECT]: SingleSelectCustomFieldValueDto,
  [CustomFieldType.MULTI_SELECT]: MultiSelectCustomFieldValueDto,
  [CustomFieldType.MONETARY]: MonetaryCustomFieldValueDto,
} satisfies Record<CustomFieldType, CustomFieldValueDtoClass>

function getCustomFieldValueDtoDiscriminatorSubTypes() {
  return Object.entries(CUSTOM_FIELD_VALUE_DTO_BY_TYPE).map(
    ([name, value]) => ({ name: name, value }),
  )
}

export function IsCustomFieldsValues(): PropertyDecorator {
  return applyDecorators(
    IsArray(),
    ArrayUnique((customField: CustomFieldValueDto) => customField.definitionUuid),
    ValidateNested({ each: true }),
    Type(() => CustomFieldValueDto, {
      discriminator: {
        property: 'type',
        subTypes: getCustomFieldValueDtoDiscriminatorSubTypes()
      },
      keepDiscriminatorProperty: true,
    }),
  )
}
