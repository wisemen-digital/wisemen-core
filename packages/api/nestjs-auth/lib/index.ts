export {
  IS_PUBLIC_KEY,
  isPublicContext,
  Public
} from './public/public.decorator.js'

export {
  type BasicAuthCredential,
  type BasicAuthDefinitions,
  BasicAuth,
  BasicAuthService,
  BasicAuthModule,
  createBasicAuthMiddleware,
  createBasicAuthRequestHandler
} from "./basic/index.js"

export { BearerAuthModule as AuthModule, AUTH_CONFIG } from './bearer/bearer-auth-module.js'
export { Authenticator } from './bearer/authenticator/authenticator.js'
export { InjectAuthenticator, getAuthenticatorToken } from './bearer/authenticator/authenticator.tokens.js'
export { resolveOidcTrust, selectOidcCustomClaims } from './bearer/oidc/index.js'
export { DynamicOidcAuthenticator, DynamicOidcTrust, DynamicOidcTrustResolver } from './bearer/oidc/index.js'
export { IdentityCreatedEvent } from './bearer/oidc/identity/identity-created.event.js'
export { Identity } from './bearer/oidc/identity/identity.entity.js'
export { ApiKey } from './bearer/api-key/api-key.entity.js'
export { IdentityUuid } from './bearer/oidc/identity/identity.uuid.js'
export type {
  BearerAuthConfig ,
  BearerAuthModuleAsyncOptions,
  BearerAuthModuleOptions,
  OidcTrustAsyncOptions
} from './bearer/bearer-auth-module-options.js'
export type {
  OidcAuthenticator,
  OidcTrust,
  OidcTrustClaimNames,
  OidcTrustId,
  OidcTrustOptions,
  ResolvedOidcTrustClaimNames,
  StaticOidcTrusts
} from './bearer/oidc/index.js'
