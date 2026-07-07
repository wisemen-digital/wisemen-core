import { CustomFieldValueDto, getCustomFieldValueDtoDiscriminatorSubTypes } from '#src/dto/custom-field-value.dto.js'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { ArrayUnique, IsArray, ValidateNested } from 'class-validator'

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
