import { ApiProperty } from '@nestjs/swagger'
import { Currency, IsMonetary, MonetaryDto } from '@wisemen/monetary'
import { IsEnum } from 'class-validator'
import { createCustomFieldValueDto, CustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MonetaryCustomFieldValue } from './monetary.value.js'

export class MonetaryCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.MONETARY] })
  @IsEnum([CustomFieldType.MONETARY])
  type: CustomFieldType.MONETARY = CustomFieldType.MONETARY

  @ApiProperty({ type: MonetaryDto })
  @IsMonetary()
  value: MonetaryDto<Currency>

  parse(): MonetaryCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.MONETARY, this.value.parse())
  }

  static fromCustomFieldValue(customFieldValue: MonetaryCustomFieldValue): MonetaryCustomFieldValueDto {
    return createCustomFieldValueDto(
      new MonetaryCustomFieldValueDto(),
      customFieldValue.definitionUuid,
      MonetaryDto.from(customFieldValue.value)
    )
  }
}
