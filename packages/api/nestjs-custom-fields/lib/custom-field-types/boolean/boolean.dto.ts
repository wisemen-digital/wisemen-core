import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { BooleanCustomFieldValue } from './boolean.value.js'

export class BooleanCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.BOOLEAN] })
  @IsEnum([CustomFieldType.BOOLEAN])
  type: CustomFieldType.BOOLEAN = CustomFieldType.BOOLEAN

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  value: boolean

  parse(): BooleanCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.BOOLEAN, this.value)
  }

  static from(customFieldValue: BooleanCustomFieldValue): BooleanCustomFieldValueDto {
    return createCustomFieldValueDto(new BooleanCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}
