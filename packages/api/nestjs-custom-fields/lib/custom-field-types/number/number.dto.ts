import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { createCustomFieldValueDto, CustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { NumberCustomFieldValue } from './number.value.js'

export class NumberCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.NUMBER] })
  @IsEnum([CustomFieldType.NUMBER])
  type: CustomFieldType.NUMBER = CustomFieldType.NUMBER

  @ApiProperty({ type: Number })
  @IsNumber()
  value: number

  parse(): NumberCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.NUMBER, this.value)
  }

  static fromCustomFieldValue(customFieldValue: NumberCustomFieldValue): NumberCustomFieldValueDto {
    return createCustomFieldValueDto(new NumberCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}
