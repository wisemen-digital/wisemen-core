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

export { BearerAuthModule, AUTH_CONFIG } from './bearer/bearer-auth-module.js'
export {
  BearerAuthService,
  type ApiKeyInsert,
  type DynamicOidcTrustInsert,
  type DynamicOidcTrustUpdate
} from './bearer/bearer-auth.service.js'
export { BearerAuthContext } from './bearer/bearer-auth.context.js'
export { Authenticator } from './bearer/authenticator/authenticator.js'
export { InjectAuthenticator, getAuthenticatorToken, InjectDynamicAuthenticator } from './bearer/authenticator/authenticator.tokens.js'
export { InjectAuthMiddleware, InjectDynamicAuthMiddleware, getMiddlewareToken } from './bearer/middleware/middleware.tokens.js'
export { resolveOidcTrust, selectOidcCustomClaims } from './bearer/oidc/index.js'
export { DynamicOidcAuthenticator, DynamicOidcTrust, DynamicOidcTrustResolver } from './bearer/oidc/index.js'
export {
  IdentityCreatedEvent,
  IdentityCreatedEventContent
} from './bearer/oidc/identity/identity-created.event.js'
export { Identity } from './bearer/oidc/identity/identity.entity.js'
export { IdentityBuilder } from './bearer/oidc/identity/identity.entity.builder.js'
export { ApiKey } from './bearer/api-key/api-key.entity.js'
export {
  ApiKeyCreatedEvent,
  ApiKeyDeletedEvent,
  ApiKeyEventContent
} from './bearer/api-key/api-key.events.js'
export {
  DynamicOidcTrustCreatedEvent,
  DynamicOidcTrustUpdatedEvent,
  DynamicOidcTrustDeletedEvent,
  DynamicOidcTrustEventContent
} from './bearer/oidc/dynamic-oidc/dynamic-oidc-trust.events.js'
export { ApiKeyUuid } from './bearer/api-key/api-key.uuid.js'
export { IdentityUuid } from './bearer/oidc/identity/identity.uuid.js'
export { OidcTrustUuid } from './bearer/oidc/oidc-trust.uuid.js'
export { BearerAuthMiddleware } from './bearer/middleware/bearer-auth.middleware.js'
export {
  type AuthenticatedApiKey,
  type AuthenticatedIdentity,
  type AuthenticatedPrincipal
} from './bearer/principal/auth-principal.js'
export { ApiKeySecret } from './bearer/api-key/api-key-secret.js'
export { API_KEY_PREFIX, SCHEMA_NAME } from './bearer/constants.js'
export {
  getOidcAuthenticatorToken,
  getOidcTrustToken,
  getOidcTrustVerifierToken,
  InjectOidcAuthenticator,
  InjectOidcTrust,
  InjectOidcTrustVerifier
} from './bearer/oidc/oidc-trust.tokens.js'
export { IdentityNotFoundAfterCreationError } from './bearer/errors/identity-not-found-after-creation.error.js'
export { InvalidAuthorizationHeaderFormatError } from './bearer/errors/invalid-authorization-header-format.error.js'
export { InvalidOidcSubjectClaimError } from './bearer/errors/invalid-oidc-subject-claim.error.js'
export { InvalidOrExpiredApiKeyError } from './bearer/errors/invalid-or-expired-api-key.error.js'
export { NoAuthenticationContextError } from './bearer/errors/no-authentication-context.error.js'
export { NoAuthorizationHeaderError } from './bearer/errors/no-authorization-header.error.js'
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

export { RbacModule } from './rbac/rbac.module.js'
export { Role } from './rbac/entity/role.entity.js'
export type { RoleUuid } from './rbac/entity/role.uuid.js'
export {
  RoleEvent,
  RoleCreatedEvent,
  RoleCreatedEventContent,
  RoleDeletedEvent,
  RoleDeletedEventContent,
  RoleRenamedEvent,
  RoleRenamedEventContent,
  RolePermissionsUpdatedEvent,
  RolePermissionsUpdatedEventContent,
  RolePermissionsCacheClearedEvent,
  RolePermissionsCacheClearedEventContent
} from './rbac/events/role.events.js'
export { RoleNameAlreadyInUseError } from './rbac/errors/role-name-already-in-use.error.js'
export { RoleNotEditableError, RoleNotEditableErrorMeta } from './rbac/errors/role-not-editable.error.js'
export { RoleNotFoundError } from './rbac/errors/role-not-found.error.js'
export type {
  PermissionEnum,
  RbacControllers,
  RbacControllerDecorators,
  RbacModuleOptions,
  RoleAssignment,
  RoleResponse
} from './rbac/rbac.types.js'
export { RolePermissionsCache } from './rbac/cache/role-permissions.cache.js'
export { getRolePermissionsCacheToken, InjectRolePermissionsCache } from './rbac/rbac.tokens.js'
export { CreateRoleCommand } from './rbac/use-cases/create-role/create-role.command.js'
export { CreateRoleResponse } from './rbac/use-cases/create-role/create-role.response.js'
export { UpdateRoleCommand } from './rbac/use-cases/update-role/update-role.command.js'
export { ClearRolePermissionsCacheCommand } from './rbac/use-cases/clear-role-permissions-cache/clear-role-permissions-cache.command.js'
export {
  createUpdateRolesPermissionsCommand
} from './rbac/use-cases/update-roles-permissions/update-roles-permissions.command.js'
export type { UpdateRolesPermissionsCommand } from './rbac/use-cases/update-roles-permissions/update-roles-permissions.command.js'
