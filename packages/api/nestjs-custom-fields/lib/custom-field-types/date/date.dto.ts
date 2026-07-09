import { ApiProperty } from '@nestjs/swagger'
import { IsPlainDate, plainDate, PlainDateApiProperty } from '@wisemen/datewise'
import { IsEnum } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { DateCustomFieldValue } from '#src/custom-field-types/date/date.value.js'

export class DateCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.DATE] })
  @IsEnum([CustomFieldType.DATE])
  declare type: CustomFieldType.DATE

  @PlainDateApiProperty()
  @IsPlainDate()
  value: string

  parse(): DateCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.DATE, plainDate(this.value))
  }

  static from(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto {
    return createCustomFieldValueDto(new DateCustomFieldValueDto(), CustomFieldType.DATE, customFieldValue.definitionUuid, customFieldValue.value.toString())
  }
}
