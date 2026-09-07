export type { OidcAuthenticator } from './oidc-authenticator.js'
export { DynamicOidcAuthenticator } from './dynamic-oidc/dynamic-oidc-authenticator.js'
export { DynamicOidcTrust } from './dynamic-oidc/dynamic-oidc-trust.entity.js'
export { DynamicOidcTrustResolver } from './dynamic-oidc/dynamic-oidc-trust-resolver.js'
export { resolveOidcTrust, selectOidcCustomClaims } from './oidc-trust.js'
export type {
  OidcTrust,
  OidcTrustClaimNames,
  OidcTrustId,
  OidcTrustOptions,
  ResolvedOidcTrustClaimNames,
  StaticOidcTrusts
} from './oidc-trust.js'
