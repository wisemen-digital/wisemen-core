import { ApiProperty } from '@nestjs/swagger'
import { IsUndefinable } from '@wisemen/validators'
import { Type } from 'class-transformer'
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator'

export class Translations {
  @ApiProperty({ type: String, required: false })
  @IsUndefinable()
  @IsString()
  nl?: string

  @ApiProperty({ type: String, required: false })
  @IsUndefinable()
  @IsString()
  en?: string
}

export class SendPushNotificationCommand {
  @ApiProperty({ type: String })
  @IsString()
  name: string

  @ApiProperty({ type: Translations })
  @IsObject()
  @ValidateNested()
  @Type(() => Translations)
  title: Translations

  @ApiProperty({ type: Translations })
  @IsObject()
  @ValidateNested()
  @Type(() => Translations)
  description: Translations

  @ApiProperty({ type: String, format: 'uuid', isArray: true })
  @IsArray()
  @IsString({ each: true })
  userUuids: string[]
}
