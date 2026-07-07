import { ApiProperty } from '@nestjs/swagger'
import { timestamp } from '@wisemen/datewise'
import { IsDateStringWithTimezone } from '@wisemen/validators'
import { IsEnum } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { TimestampCustomFieldValue } from '#src/custom-field-types/timestamp/timestamp.value.js'

export class DateTimeCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TIMESTAMP] })
  @IsEnum([CustomFieldType.TIMESTAMP])
  declare type: CustomFieldType.TIMESTAMP

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateStringWithTimezone({ strict: true })
  value: string

  parse(): TimestampCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TIMESTAMP, timestamp(this.value))
  }

  static from(customFieldValue: TimestampCustomFieldValue): DateTimeCustomFieldValueDto {
    return createCustomFieldValueDto(
      new DateTimeCustomFieldValueDto(),
      CustomFieldType.TIMESTAMP,
      customFieldValue.definitionUuid,
      customFieldValue.value.toISOString()
    )
  }
}
