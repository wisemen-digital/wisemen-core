import type { AuthenticatedIdentity } from '../principal/auth-principal.js'

/**
 * Verifies a bearer token as an OIDC identity.
 *
 * Static and dynamic trust implementations share this contract. API-key
 * handling intentionally stays in `Authenticator`.
 */
export interface OidcAuthenticator {
  authenticate<TClaims extends object = object>(
    token: string
  ): Promise<AuthenticatedIdentity<TClaims>>
}
