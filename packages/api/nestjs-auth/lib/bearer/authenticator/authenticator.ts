import { NoAuthorizationHeaderError } from '../errors/no-authorization-header.error.js'
import { InvalidAuthorizationHeaderFormatError } from '../errors/invalid-authorization-header-format.error.js'
import { API_KEY_PREFIX } from '../constants.js'
import type { AuthenticatedPrincipal } from '../principal/auth-principal.js'
import { ApiKeyAuthenticator } from '../api-key/api-key-authenticator.js'
import type { OidcAuthenticator } from '../oidc/oidc-authenticator.js'

export class Authenticator {
  constructor (
    private apiKeyAuthenticator: ApiKeyAuthenticator,
    private oidcAuthenticator: OidcAuthenticator
  ) { }

  async authenticate<TClaims extends object = object>(
    authorizationHeader?: string
  ): Promise<AuthenticatedPrincipal<TClaims>> {
    if (authorizationHeader == null) {
      throw new NoAuthorizationHeaderError()
    }

    const token = this.extractBearerToken(authorizationHeader)
    if (token == null) {
      throw new InvalidAuthorizationHeaderFormatError()
    }

    if (token.startsWith(API_KEY_PREFIX)) {
      return this.apiKeyAuthenticator.authenticate(token)
    }

    return this.oidcAuthenticator.authenticate(token)
  }

  private extractBearerToken (authorization?: string): string | null {
    if (authorization == null) {
      return null
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i)

    if (match == null) {
      return null
    }

    const token = match[1].trim()

    return token.length > 0 ? token : null
  }
}
