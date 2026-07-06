import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { createCustomFieldValueDto, CustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MultiSelectCustomFieldValue } from './multi-select.value.js'

export class MultiSelectCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.MULTI_SELECT] })
  @IsEnum([CustomFieldType.MULTI_SELECT])
  type: CustomFieldType.MULTI_SELECT = CustomFieldType.MULTI_SELECT

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): MultiSelectCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.MULTI_SELECT, this.value)
  }

  static fromCustomFieldValue(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto {
    return createCustomFieldValueDto(new MultiSelectCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}
