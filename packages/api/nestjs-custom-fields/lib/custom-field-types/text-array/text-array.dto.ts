import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { createCustomFieldValueDto, CustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextArrayCustomFieldValue } from './text-array.value.js'

export class TextArrayCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TEXT_ARRAY] })
  @IsEnum([CustomFieldType.TEXT_ARRAY])
  type: CustomFieldType.TEXT_ARRAY = CustomFieldType.TEXT_ARRAY

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): TextArrayCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TEXT_ARRAY, this.value)
  }

  static fromCustomFieldValue(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto {
    return createCustomFieldValueDto(new TextArrayCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}
