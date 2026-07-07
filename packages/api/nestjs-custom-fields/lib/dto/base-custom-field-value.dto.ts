import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import type { BooleanCustomFieldValueDto } from '#src/custom-field-types/boolean/boolean.dto.js'
import type { DateCustomFieldValueDto } from '#src/custom-field-types/date/date.dto.js'
import type { MonetaryCustomFieldValueDto } from '#src/custom-field-types/monetary/monetary.dto.js'
import type { MultiSelectCustomFieldValueDto } from '#src/custom-field-types/multi-select/multi-select.dto.js'
import type { NumberCustomFieldValueDto } from '#src/custom-field-types/number/number.dto.js'
import type { SingleSelectCustomFieldValueDto } from '#src/custom-field-types/single-select/single-select.dto.js'
import type { TextArrayCustomFieldValueDto } from '#src/custom-field-types/text-array/text-array.dto.js'
import type { TextCustomFieldValueDto } from '#src/custom-field-types/text/text.dto.js'
import type { DateTimeCustomFieldValueDto } from '#src/custom-field-types/timestamp/timestamp.dto.js'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { TextCustomFieldValue, TextArrayCustomFieldValue, NumberCustomFieldValue, BooleanCustomFieldValue, DateCustomFieldValue, TimestampCustomFieldValue, SingleSelectCustomFieldValue, MultiSelectCustomFieldValue, MonetaryCustomFieldValue } from '#src/custom-field-types/index.js'
import { CustomFieldValue, BaseCustomFieldValue } from '#src/custom-field-value.js'

type CustomFieldValueDtoResolver = (customFieldValue: CustomFieldValue) => CustomFieldValueDto

export abstract class CustomFieldValueDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  definitionUuid: CustomFieldDefinitionUuid

  abstract type: CustomFieldType

  private static fromCustomFieldValueResolver: CustomFieldValueDtoResolver | null = null

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

  static registerFromCustomFieldValue(resolver: CustomFieldValueDtoResolver): void {
    this.fromCustomFieldValueResolver = resolver
  }

  static from(customFieldValue: TextCustomFieldValue): TextCustomFieldValueDto
  static from(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto
  static from(customFieldValue: NumberCustomFieldValue): NumberCustomFieldValueDto
  static from(customFieldValue: BooleanCustomFieldValue): BooleanCustomFieldValueDto
  static from(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto
  static from(customFieldValue: TimestampCustomFieldValue): DateTimeCustomFieldValueDto
  static from(customFieldValue: SingleSelectCustomFieldValue): SingleSelectCustomFieldValueDto
  static from(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto
  static from(customFieldValue: MonetaryCustomFieldValue): MonetaryCustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): CustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): CustomFieldValueDto {
    if (this.fromCustomFieldValueResolver === null) {
      throw new Error('CustomFieldValueDto resolver has not been registered')
    }

    return this.fromCustomFieldValueResolver(customFieldValue)
  }
}

type CustomFieldValueDtoWithValue<TValue> = CustomFieldValueDto & { value: TValue }

export function createCustomFieldValueDto<TValue, TDto extends CustomFieldValueDtoWithValue<TValue>>(
  dto: TDto,
  definitionUuid: CustomFieldDefinitionUuid,
  value: TValue
): TDto {
  dto.definitionUuid = definitionUuid
  dto.value = value
  return dto
}
