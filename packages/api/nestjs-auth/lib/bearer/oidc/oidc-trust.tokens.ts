import { Inject, type InjectionToken } from '@nestjs/common'
import { getJwtVerifierToken, type JwtVerifierToken } from '@wisemen/nestjs-jwt-verifier'
import type { OidcTrustId } from './oidc-trust.js'

/**
 * Returns the token containing the configured trust definition.
 */
export function getOidcTrustToken (id: OidcTrustId): InjectionToken {
  return `wisemen.auth.oidc-trust.${id}`
}

/**
 * Injects the configured definition for one static OIDC trust.
 */
export function InjectOidcTrust (id: OidcTrustId): ParameterDecorator {
  return Inject(getOidcTrustToken(id))
}

/**
 * The named JWT verifier used by one static OIDC trust.
 */
export function getOidcTrustVerifierToken (id: OidcTrustId): JwtVerifierToken {
  return getJwtVerifierToken(getOidcTrustVerifierName(id))
}

/**
 * Injects the JWT verifier bound to one static OIDC trust.
 *
 * A future trust-specific authenticator should depend on this token instead of
 * choosing a verifier from token contents.
 */
export function InjectOidcTrustVerifier (id: OidcTrustId): ParameterDecorator {
  return Inject(getOidcTrustVerifierToken(id))
}

/**
 * Returns the authenticator token bound to one static OIDC trust.
 */
export function getOidcAuthenticatorToken (id: OidcTrustId): InjectionToken {
  return `wisemen.auth.oidc-authenticator.${id}`
}

/**
 * Injects the authenticator bound to one static OIDC trust.
 */
export function InjectOidcAuthenticator (id: OidcTrustId): ParameterDecorator {
  return Inject(getOidcAuthenticatorToken(id))
}

function getOidcTrustVerifierName (id: OidcTrustId): string {
  return `oidc-trust.${id}`
}
