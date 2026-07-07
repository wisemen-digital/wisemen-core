import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { MultiSelectCustomFieldValue } from '#src/custom-field-types/multi-select/multi-select.value.js'

export class MultiSelectCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.MULTI_SELECT] })
  @IsEnum([CustomFieldType.MULTI_SELECT])
  declare type: CustomFieldType.MULTI_SELECT

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): MultiSelectCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.MULTI_SELECT, this.value)
  }

  static from(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto {
    return createCustomFieldValueDto(new MultiSelectCustomFieldValueDto(), CustomFieldType.MULTI_SELECT, customFieldValue.definitionUuid, customFieldValue.value)
  }
}
