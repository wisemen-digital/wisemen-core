import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { TextArrayCustomFieldValue } from '#src/custom-field-types/text-array/text-array.value.js'

export class TextArrayCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TEXT_ARRAY] })
  @IsEnum([CustomFieldType.TEXT_ARRAY])
  declare type: CustomFieldType.TEXT_ARRAY

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): TextArrayCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TEXT_ARRAY, this.value)
  }

  static from(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto {
    return createCustomFieldValueDto(new TextArrayCustomFieldValueDto(), CustomFieldType.TEXT_ARRAY, customFieldValue.definitionUuid, customFieldValue.value)
  }
}
