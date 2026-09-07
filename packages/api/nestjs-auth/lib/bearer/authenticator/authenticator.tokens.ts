import { Inject, type InjectionToken } from '@nestjs/common'
import type { OidcTrustId } from '../oidc/oidc-trust.js'

/**
 * Returns the API key + OIDC authenticator token for one static OIDC trust.
 */
export function getAuthenticatorToken (id: OidcTrustId): InjectionToken {
  return `wisemen.auth.authenticator.${id}`
}

/**
 * Injects the API key + OIDC authenticator for one static OIDC trust.
 */
export function InjectAuthenticator (id: OidcTrustId): ParameterDecorator {
  return Inject(getAuthenticatorToken(id))
}
