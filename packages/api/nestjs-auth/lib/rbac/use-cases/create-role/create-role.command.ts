import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateRoleCommand {
  @ApiProperty({ type: String, description: 'The name of the role' })
  @IsNotEmpty()
  @IsString()
  name: string
}
