import { ApiProperty } from '@nestjs/swagger'
import { plainDate } from '@wisemen/datewise'
import { IsDateWithoutTimeString } from '@wisemen/validators'
import { IsEnum } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { DateCustomFieldValue } from './date.value.js'

export class DateCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.DATE] })
  @IsEnum([CustomFieldType.DATE])
  type: CustomFieldType.DATE = CustomFieldType.DATE

  @ApiProperty({ type: String, format: 'date' })
  @IsDateWithoutTimeString()
  value: string

  parse(): DateCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.DATE, plainDate(this.value))
  }

  static from(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto {
    return createCustomFieldValueDto(new DateCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value.toString())
  }
}
