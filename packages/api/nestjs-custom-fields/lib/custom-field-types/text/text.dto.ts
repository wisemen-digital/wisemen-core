import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextCustomFieldValue } from './text.value.js'

export class TextCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TEXT] })
  @IsEnum([CustomFieldType.TEXT])
  type: CustomFieldType.TEXT = CustomFieldType.TEXT

  @ApiProperty({ type: String })
  @IsString()
  value: string

  parse(): TextCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TEXT, this.value)
  }

  static from(customFieldValue: TextCustomFieldValue): TextCustomFieldValueDto {
    return createCustomFieldValueDto(new TextCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

