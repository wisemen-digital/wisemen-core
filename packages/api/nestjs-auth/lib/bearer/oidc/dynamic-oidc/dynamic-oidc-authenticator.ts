import type { AuthenticatedIdentity } from '../../principal/auth-principal.js'
import type { OidcAuthenticator } from '../oidc-authenticator.js'
import type { DynamicOidcTrustResolver } from './dynamic-oidc-trust-resolver.js'
import { OidcIdentityAuthenticator } from '../identity/oidc-identity-authenticator.js'

type OidcTokenContent = Record<string, unknown>

/**
 * Authenticates a bearer token against the database trust selected from its
 * unverified issuer and audience claims.
 */
export class DynamicOidcAuthenticator implements OidcAuthenticator {
  constructor (
    private trustResolver: DynamicOidcTrustResolver,
    private identityAuthenticator: OidcIdentityAuthenticator
  ) { }

  async authenticate<TClaims extends object = object> (
    token: string
  ): Promise<AuthenticatedIdentity<TClaims>> {
    const resolvedTrust = await this.trustResolver.resolve(token)
    const tokenContent = await resolvedTrust.verifier.verify<OidcTokenContent>(token)
    return await this.identityAuthenticator.authenticate(resolvedTrust.trust, tokenContent)
  }
}
