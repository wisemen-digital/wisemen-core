import { jwtVerify, type JWTPayload as RawPayload, type JWTVerifyGetKey } from 'jose'
import { InvalidOrExpiredTokenError } from './errors/invalid-or-expired-token.error.js'
import type { JwtVerifierOptions } from './jwt-verifier.module-options.js'

export type JWTPayload = Pick<RawPayload, 
  | 'iss' 
  | 'sub'
  | 'aud'
  | 'jti'
  | 'nbf'
  | 'exp'
  | 'iat'
>

export class JwtVerifier {
  constructor (
    private options: JwtVerifierOptions,
    private jwkSet: JWTVerifyGetKey
  ) {}

  async verify<TToken extends JWTPayload = JWTPayload> (token: string): Promise<TToken> {
    try {
      const { payload } = await jwtVerify<TToken>(token, this.jwkSet, {
        issuer: this.options.issuer,
        audience: this.options.audiences
      })

      return payload
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidOrExpiredTokenError()
      }

      throw error
    }
  }
}
