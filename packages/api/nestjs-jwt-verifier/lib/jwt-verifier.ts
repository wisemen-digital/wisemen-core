import { createRemoteJWKSet, decodeJwt, jwtVerify, type JWTPayload as RawPayload, type JWTVerifyGetKey } from 'jose'
import { InvalidOrExpiredTokenError } from './errors/invalid-or-expired-token.error.js'
import { resolveJwtVerifierOptions, type JwtVerifierOptions } from './jwt-verifier.module-options.js'

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

/**
 * Creates a verifier backed by the configured remote JWKS endpoint.
 *
 * Use this when a verifier must be resolved at runtime rather than registered
 * as a static Nest provider.
 */
export function createJwtVerifier (options: JwtVerifierOptions): JwtVerifier {
  const resolvedOptions = resolveJwtVerifierOptions(options)
  const jwkSet = createRemoteJWKSet(new URL(resolvedOptions.jwksEndpoint))

  return new JwtVerifier(resolvedOptions, jwkSet)
}

/**
 * Decodes an unverified token only for selecting a candidate verifier.
 *
 * Callers must verify the original token with the selected verifier before
 * trusting any returned claims.
 */
export function decodeJwtPayload<TToken extends JWTPayload = JWTPayload> (token: string): TToken {
  try {
    return decodeJwt(token) as TToken
  } catch {
    throw new InvalidOrExpiredTokenError()
  }
}
