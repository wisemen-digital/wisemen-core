import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { SingleSelectCustomFieldValue } from './single-select.value.js'

export class SingleSelectCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.SINGLE_SELECT] })
  @IsEnum([CustomFieldType.SINGLE_SELECT])
  type: CustomFieldType.SINGLE_SELECT = CustomFieldType.SINGLE_SELECT

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  value: string

  parse(): SingleSelectCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.SINGLE_SELECT, this.value)
  }

  static from(customFieldValue: SingleSelectCustomFieldValue): SingleSelectCustomFieldValueDto {
    return createCustomFieldValueDto(new SingleSelectCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}
