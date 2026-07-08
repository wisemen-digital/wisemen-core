import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { IsUniqueLanguage } from './validators/is-unique-language.js'
import { LocalizedString, LocalizedValue } from './localized-string.js'
import { LocalizedStringItemDtoBuilder } from '#src/localized-string-item-dto.builder.js'

export class LocalizedStringItemDto {
  @ApiProperty({ type: String })
  @IsString()
  locale: string

  @ApiProperty({ type: String })
  @IsString()
  value: string

  static from(value: LocalizedValue): LocalizedStringItemDto {
    return new LocalizedStringItemDtoBuilder()
      .withLocale(value.locale)
      .withValue(value.value)
      .build()
  }
}

export class LocalizedStringDto {
  @ApiProperty({ type: LocalizedStringItemDto, isArray: true })
  @Type(() => LocalizedStringItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  @IsUniqueLanguage()
  items: LocalizedStringItemDto[]

  static from(value: LocalizedValue[] | LocalizedString): LocalizedStringDto {
    const dto = new LocalizedStringDto()
    const localizedValues = Array.isArray(value) ? value : value.toJSON()

    dto.items = localizedValues.map(value => LocalizedStringItemDto.from(value))

    return dto
  }

  parse(): LocalizedString {
    return new LocalizedString(this.items)
  }
}
