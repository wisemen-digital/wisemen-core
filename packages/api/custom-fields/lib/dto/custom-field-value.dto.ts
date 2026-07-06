import { ApiExtraModels, ApiProperty, type ApiPropertyOptions, getSchemaPath } from '@nestjs/swagger'
import { plainDate, timestamp } from '@wisemen/datewise'
import { Currency, IsMonetary, Monetary, MonetaryDto } from '@wisemen/monetary'
import { IsDateWithoutTimeString } from '@wisemen/validators'
import { ArrayUnique, IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { BaseCustomFieldValue, BooleanCustomFieldValue, CustomFieldValue, DateCustomFieldValue, MonetaryCustomFieldValue, MultiSelectCustomFieldValue, NumberCustomFieldValue, SingleSelectCustomFieldValue, TextArrayCustomFieldValue, TextCustomFieldValue, TimestampCustomFieldValue } from '#src/custom-field-value.js'

export abstract class CustomFieldValueDto {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID()
  definitionUuid: CustomFieldDefinitionUuid

  abstract type: CustomFieldType

  protected toCustomFieldValue<TType extends CustomFieldType, TValue>(
    type: TType,
    value: TValue
  ): BaseCustomFieldValue<TType, TValue> {
    return {
      definitionUuid: this.definitionUuid,
      type,
      value
    }
  }

  abstract parse(): CustomFieldValue

  static from(customFieldValue: TextCustomFieldValue): TextCustomFieldValueDto
  static from(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto
  static from(customFieldValue: NumberCustomFieldValue): NumberCustomFieldValueDto
  static from(customFieldValue: BooleanCustomFieldValue): BooleanCustomFieldValueDto
  static from(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto
  static from(customFieldValue: TimestampCustomFieldValue): DateTimeCustomFieldValueDto
  static from(customFieldValue: SingleSelectCustomFieldValue): SingleSelectCustomFieldValueDto
  static from(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto
  static from(customFieldValue: MonetaryCustomFieldValue): MonetaryCustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): CustomFieldValueDto
  static from(customFieldValue: CustomFieldValue): CustomFieldValueDto {
    switch (customFieldValue.type) {
      case CustomFieldType.TEXT:
        return TextCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.TEXT_ARRAY:
        return TextArrayCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.NUMBER:
        return NumberCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.BOOLEAN:
        return BooleanCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.DATE:
        return DateCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.TIMESTAMP:
        return DateTimeCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.SINGLE_SELECT:
        return SingleSelectCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.MULTI_SELECT:
        return MultiSelectCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      case CustomFieldType.MONETARY:
        return MonetaryCustomFieldValueDto.fromCustomFieldValue(customFieldValue)
      default:
        exhaustiveCheck(customFieldValue)
    }
  }
}

export class TextCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TEXT] })
  @IsEnum([CustomFieldType.TEXT])
  type: CustomFieldType.TEXT = CustomFieldType.TEXT

  @ApiProperty({ type: String })
  @IsString()
  value: string

  parse(): TextCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TEXT, this.value)
  }

  static fromCustomFieldValue(customFieldValue: TextCustomFieldValue): TextCustomFieldValueDto {
    return createCustomFieldValueDto(new TextCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

export class TextArrayCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TEXT_ARRAY] })
  @IsEnum([CustomFieldType.TEXT_ARRAY])
  type: CustomFieldType.TEXT_ARRAY = CustomFieldType.TEXT_ARRAY

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): TextArrayCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TEXT_ARRAY, this.value)
  }

  static fromCustomFieldValue(customFieldValue: TextArrayCustomFieldValue): TextArrayCustomFieldValueDto {
    return createCustomFieldValueDto(new TextArrayCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

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

export class BooleanCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.BOOLEAN] })
  @IsEnum([CustomFieldType.BOOLEAN])
  type: CustomFieldType.BOOLEAN = CustomFieldType.BOOLEAN

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  value: boolean

  parse(): BooleanCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.BOOLEAN, this.value)
  }

  static fromCustomFieldValue(customFieldValue: BooleanCustomFieldValue): BooleanCustomFieldValueDto {
    return createCustomFieldValueDto(new BooleanCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

export class DateCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.DATE] })
  @IsEnum([CustomFieldType.DATE])
  type: CustomFieldType.DATE = CustomFieldType.DATE

  @ApiProperty({ type: String, format: 'date' })
  @IsDateWithoutTimeString()
  value: string

  parse(): DateCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.DATE, plainDate(this.value))
  }

  static fromCustomFieldValue(customFieldValue: DateCustomFieldValue): DateCustomFieldValueDto {
    return createCustomFieldValueDto(new DateCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value.toString())
  }
}

export class DateTimeCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.TIMESTAMP] })
  @IsEnum([CustomFieldType.TIMESTAMP])
  type: CustomFieldType.TIMESTAMP = CustomFieldType.TIMESTAMP

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString({ strict: true })
  value: string

  parse(): TimestampCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.TIMESTAMP, timestamp(this.value))
  }

  static fromCustomFieldValue(customFieldValue: TimestampCustomFieldValue): DateTimeCustomFieldValueDto {
    return createCustomFieldValueDto(new DateTimeCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value.toISOString())
  }
}

export class SingleSelectCustomFieldValueDto extends CustomFieldValueDto {
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

  static fromCustomFieldValue(customFieldValue: SingleSelectCustomFieldValue): SingleSelectCustomFieldValueDto {
    return createCustomFieldValueDto(new SingleSelectCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

export class MultiSelectCustomFieldValueDto extends CustomFieldValueDto {
  @ApiProperty({ enum: [CustomFieldType.MULTI_SELECT] })
  @IsEnum([CustomFieldType.MULTI_SELECT])
  type: CustomFieldType.MULTI_SELECT = CustomFieldType.MULTI_SELECT

  @ApiProperty({ type: String, isArray: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @ArrayUnique()
  value: string[]

  parse(): MultiSelectCustomFieldValue {
    return this.toCustomFieldValue(CustomFieldType.MULTI_SELECT, this.value)
  }

  static fromCustomFieldValue(customFieldValue: MultiSelectCustomFieldValue): MultiSelectCustomFieldValueDto {
    return createCustomFieldValueDto(new MultiSelectCustomFieldValueDto(), customFieldValue.definitionUuid, customFieldValue.value)
  }
}

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
      MonetaryDto.from(customFieldValue.value as Monetary<Currency>)
    )
  }
}

type CustomFieldValueDtoWithValue<TValue> = CustomFieldValueDto & { value: TValue }

function createCustomFieldValueDto<TValue, TDto extends CustomFieldValueDtoWithValue<TValue>>(
  dto: TDto,
  definitionUuid: CustomFieldDefinitionUuid,
  value: TValue
): TDto {
  dto.definitionUuid = definitionUuid
  dto.value = value
  return dto
}

export const CUSTOM_FIELD_VALUE_DTOS = [
  TextCustomFieldValueDto,
  TextArrayCustomFieldValueDto,
  NumberCustomFieldValueDto,
  BooleanCustomFieldValueDto,
  DateCustomFieldValueDto,
  DateTimeCustomFieldValueDto,
  SingleSelectCustomFieldValueDto,
  MultiSelectCustomFieldValueDto,
  MonetaryCustomFieldValueDto
] as const


function getCustomFieldValueDtoSchemaPathMapping(): Record<CustomFieldType, string> {
  return {
    [CustomFieldType.TEXT]: getSchemaPath(TextCustomFieldValueDto),
    [CustomFieldType.TEXT_ARRAY]: getSchemaPath(TextArrayCustomFieldValueDto),
    [CustomFieldType.NUMBER]: getSchemaPath(NumberCustomFieldValueDto),
    [CustomFieldType.BOOLEAN]: getSchemaPath(BooleanCustomFieldValueDto),
    [CustomFieldType.DATE]: getSchemaPath(DateCustomFieldValueDto),
    [CustomFieldType.TIMESTAMP]: getSchemaPath(DateTimeCustomFieldValueDto),
    [CustomFieldType.SINGLE_SELECT]: getSchemaPath(SingleSelectCustomFieldValueDto),
    [CustomFieldType.MULTI_SELECT]: getSchemaPath(MultiSelectCustomFieldValueDto),
    [CustomFieldType.MONETARY]: getSchemaPath(MonetaryCustomFieldValueDto)
  }
}

export function CustomFieldValueApiExtraModels(): ClassDecorator {
  return ApiExtraModels(...CUSTOM_FIELD_VALUE_DTOS)
}

export function CustomFieldValueDtoApiProperty(options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: CUSTOM_FIELD_VALUE_DTOS.map(dto => ({ $ref: getSchemaPath(dto) })),
    discriminator: {
      propertyName: 'type',
      mapping: getCustomFieldValueDtoSchemaPathMapping()
    }
  })
}
