import type { JwtVerifierOptions } from '@wisemen/nestjs-jwt-verifier'

/**
 * Stable, application-defined identifier for an OIDC trust.
 *
 * Static trust identifiers are the keys supplied to `AuthModule.forRoot(...)`
 * or `AuthModule.forRootAsync(...)`. Dynamic trust identifiers are owned by
 * the consuming application's persistence model.
 */
export type OidcTrustId = string

/**
 * Claim names used by the package to build an identity.
 */
export interface OidcTrustClaimNames {
  /**
   * The claim used to set the `subject` on the identity.
   * This must be a claim which uniquely identifies the identity.
   * Defaults to sub.
   */
  sub?: string

  /**
   * Claim names retained in `Identity.claims`.
   *
   * Every configured name is present in the stored JSONB value. When a token
   * does not contain a configured claim, its stored value is `null`.
   */
  additional?: readonly string[]
}

export interface ResolvedOidcTrustClaimNames {
  sub: string
  additional: readonly string[]
}

/**
 * Verification policy for one OIDC issuer.
 */
export interface OidcTrustOptions extends JwtVerifierOptions {
  /**
   * Optional mapping from package identity fields to JWT claim names.
   * The subject defaults to `sub`; additional claims default to an empty list.
   */
  claims?: OidcTrustClaimNames
}

/**
 * A verification policy together with its stable identifier.
 */
export interface OidcTrust extends Omit<OidcTrustOptions, 'claims'> {
  id: OidcTrustId
  claims: ResolvedOidcTrustClaimNames
}

export type StaticOidcTrusts = Readonly<Record<OidcTrustId, OidcTrustOptions>>

export function resolveOidcTrust (id: OidcTrustId, options: OidcTrustOptions): OidcTrust {
  return {
    issuer: options.issuer,
    audiences: options.audiences,
    jwksEndpoint: options.jwksEndpoint,
    id,
    claims: {
      sub: options.claims?.sub ?? 'sub',
      additional: options.claims?.additional ?? []
    }
  }
}

/**
 * Selects the configured additional claims for persistence on an identity.
 */
export function selectOidcCustomClaims (
  tokenContent: Readonly<Record<string, unknown>>,
  claims: ResolvedOidcTrustClaimNames
): Record<string, unknown> {
  return Object.fromEntries(
    claims.additional.map(claimName => [claimName, tokenContent[claimName] ?? null])
  )
}
