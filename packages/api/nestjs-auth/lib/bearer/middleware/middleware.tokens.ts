import { Inject, InjectionToken } from '@nestjs/common'
import type { OidcTrustId } from '../oidc/oidc-trust.js'
import { getAuthenticatorToken } from '../authenticator/authenticator.tokens.js'
import { BearerAuthMiddleware } from './bearer-auth.middleware.js'

/**
 * Returns the middleware token for one static OIDC trust.
 */
export function getMiddlewareToken (id: OidcTrustId): InjectionToken {
  return `wisemen.auth.middleware.${id}`
}

/**
 * Injects the middleware function for one static OIDC trust.
 */
export function InjectAuthMiddleware (id: OidcTrustId): ParameterDecorator {
  return Inject(getAuthenticatorToken(id))
}

/**
 * Injects the middleware function for one dynamic OIDC trusts.
 */
export function InjectDynamicAuthMiddleware (): ParameterDecorator {
  return Inject(BearerAuthMiddleware)
}

