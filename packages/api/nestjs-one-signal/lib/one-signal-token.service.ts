import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'
import { ONE_SIGNAL_TOKEN_OPTIONS_TOKEN } from './tokens.js'
import type { OneSignalTokenModuleOptions } from './one-signal-token.options.js'

@Injectable()
export class OneSignalTokenService {
  private readonly jwtService: JwtService

  constructor (
    @Inject(ONE_SIGNAL_TOKEN_OPTIONS_TOKEN)
    private readonly options: OneSignalTokenModuleOptions
  ) {
    this.jwtService = new JwtService({
      privateKey: {
        key: Buffer.from(this.options.privateKey, 'base64'),
        passphrase: this.options.passphrase
      },
      signOptions: {
        algorithm: 'ES256'
      }
    })
  }

  /**
   * Signs a OneSignal identity token for the given user, scoping it to the
   * configured app and setting it to expire one hour from now.
   */
  sign (userId: string): string {
    return this.jwtService.sign({
      iss: this.options.appId,
      exp: dayjs().add(1, 'hour').unix(),
      identity: {
        external_id: userId
      }
    })
  }
}
