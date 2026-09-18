import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  constructor (uuid: string) {
    this.uuid = uuid
  }
}
