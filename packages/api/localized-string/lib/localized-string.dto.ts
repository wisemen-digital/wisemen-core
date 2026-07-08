import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { IsUniqueLanguage } from './validators/is-unique-language.js'
import { LocalizedString } from './localized-string.js'

export class LocalizedStringItemDto {
  @ApiProperty({ type: String })
  @IsString()
  locale: string

  @ApiProperty({ type: String })
  @IsString()
  value: string
}

export class LocalizedStringDto {
  @ApiProperty({ type: LocalizedStringItemDto, isArray: true })
  @Type(() => LocalizedStringItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  @IsUniqueLanguage()
  items: LocalizedStringItemDto[]

  parse (): LocalizedString {
    return new LocalizedString(this.items)
  }
}
