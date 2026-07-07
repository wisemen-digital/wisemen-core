import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { CustomFieldValue, BaseCustomFieldValue } from '#src/custom-field-value.js'

export abstract class BaseCustomFieldValueDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  definitionUuid: CustomFieldDefinitionUuid

  abstract type: CustomFieldType

  protected toCustomFieldValue<TType extends CustomFieldType, TValue>(
    type: TType,
    value: TValue
  ): BaseCustomFieldValue<TType, TValue> {
    return {
      definitionUuid: this.definitionUuid,
      type,
      value
    }
  }

  abstract parse(): CustomFieldValue
}

type CustomFieldValueDtoWithValue<TValue> = BaseCustomFieldValueDto & { value: TValue }
export function createCustomFieldValueDto<TValue, TDto extends CustomFieldValueDtoWithValue<TValue>>(
  dto: TDto,
  definitionUuid: CustomFieldDefinitionUuid,
  value: TValue
): TDto {
  dto.definitionUuid = definitionUuid
  dto.value = value
  return dto
}
