import { ApiProperty } from '@nestjs/swagger'
import { timestamp } from '@wisemen/datewise'
import { IsDateStringWithTimezone } from '@wisemen/validators'
import { IsEnum } from 'class-validator'
import { createCustomFieldValueDto, CustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TimestampCustomFieldValue } from './timestamp.value.js'

export class DateTimeCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TIMESTAMP] })
  @IsEnum([CustomFieldType.TIMESTAMP])
  type: CustomFieldType.TIMESTAMP = CustomFieldType.TIMESTAMP

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateStringWithTimezone({ strict: true })
  value: string

  parse(): TimestampCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TIMESTAMP, timestamp(this.value))
  }

  static fromCustomFieldValue(customFieldValue: TimestampCustomFieldValue): DateTimeCustomFieldValueDto {
    return createCustomFieldValueDto(new DateTimeCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value.toISOString())
  }
}
