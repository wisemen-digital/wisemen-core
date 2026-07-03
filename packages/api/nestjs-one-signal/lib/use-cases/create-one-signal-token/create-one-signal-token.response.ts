import { ApiProperty } from '@nestjs/swagger'

export class CreateOneSignalTokenResponse {
  @ApiProperty({ type: String })
  token: string

  @ApiProperty({ type: String, format: 'uuid' })
  userUuid: string

  constructor (token: string, userUuid: string) {
    this.token = token
    this.userUuid = userUuid
  }
}
