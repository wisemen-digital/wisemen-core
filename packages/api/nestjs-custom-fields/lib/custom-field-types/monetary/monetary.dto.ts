import { ApiProperty } from '@nestjs/swagger'
import { Currency, IsMonetary, MonetaryDto } from '@wisemen/monetary'
import { IsEnum } from 'class-validator'
import { BaseCustomFieldValueDto, createCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { MonetaryCustomFieldValue } from '#src/custom-field-types/monetary/monetary.value.js'

export class MonetaryCustomFieldValueDto extends BaseCustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.MONETARY] })
  @IsEnum([CustomFieldType.MONETARY])
  declare type: CustomFieldType.MONETARY

  @ApiProperty({ type: MonetaryDto })
  @IsMonetary()
  value: MonetaryDto<Currency>

  parse(): MonetaryCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.MONETARY, this.value.parse())
  }

  static from(customFieldValue: MonetaryCustomFieldValue): MonetaryCustomFieldValueDto {
    return createCustomFieldValueDto(
      new MonetaryCustomFieldValueDto(),
      CustomFieldType.MONETARY,
      customFieldValue.definitionUuid,
      MonetaryDto.from(customFieldValue.value)
    )
  }
}
