import { Injectable } from '@nestjs/common'
import { OneSignalTokenService } from '../../one-signal-token.service.js'
import { CreateOneSignalTokenResponse } from './create-one-signal-token.response.js'

@Injectable()
export class CreateOneSignalTokenUseCase {
  constructor (
    private readonly tokenService: OneSignalTokenService
  ) {}

  execute (userUuid: string): CreateOneSignalTokenResponse {
    const token = this.tokenService.sign(userUuid)

    return new CreateOneSignalTokenResponse(token, userUuid)
  }
}
