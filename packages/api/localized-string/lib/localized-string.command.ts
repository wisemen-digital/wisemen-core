import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { IsUniqueLanguage } from './validators/is-unique-language.js'
import { LocalizedString } from './localized-string.js'

export class LocalizedStringItemCommand {
  @ApiProperty({ type: String })
  @IsString()
  locale: string

  @ApiProperty({ type: String })
  @IsString()
  value: string
}

export class LocalizedStringCommand {
  @ApiProperty({ type: LocalizedStringItemCommand, isArray: true })
  @Type(() => LocalizedStringItemCommand)
  @IsArray()
  @ValidateNested({ each: true })
  @IsUniqueLanguage()
  items: LocalizedStringItemCommand[]

  parse (): LocalizedString {
    return new LocalizedString(this.items)
  }
}
