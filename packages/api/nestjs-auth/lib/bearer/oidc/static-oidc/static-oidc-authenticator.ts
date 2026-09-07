import type { JWTPayload, JwtVerifier } from '@wisemen/nestjs-jwt-verifier'
import type { AuthenticatedIdentity } from '../../principal/auth-principal.js'
import type { OidcAuthenticator } from '../oidc-authenticator.js'
import type { OidcTrust } from '../oidc-trust.js'
import { OidcIdentityAuthenticator } from '../identity/oidc-identity-authenticator.js'

type OidcTokenContent = JWTPayload & Record<string, unknown>

/**
 * Authentication entry point bound to one statically registered OIDC trust.
 *
 * `AuthModule` creates one instance for every configured trust. It resolves
 * and caches identities only after the trust-specific verifier accepts a token.
 */
export class StaticOidcAuthenticator implements OidcAuthenticator {
  constructor (
    private trust: OidcTrust,
    private verifier: JwtVerifier,
    private identityAuthenticator: OidcIdentityAuthenticator
  ) { }

  async authenticate<TClaims extends object = object>(
    token: string
  ): Promise<AuthenticatedIdentity<TClaims>> {
    const tokenContent = await this.verifier.verify<OidcTokenContent>(token)

    return await this.identityAuthenticator.authenticate<TClaims>(this.trust, tokenContent)
  }
}
