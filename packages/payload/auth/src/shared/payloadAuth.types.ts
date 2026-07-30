import type {
  AuthStrategy,
  CollectionAfterChangeHook,
  Plugin,
  TypeWithID,
} from 'payload'

export interface BaseUserRecord {
  email?: string | null
  firstName?: string | null
  lastName?: string | null

  role?: string | null
  username?: string
}

export interface BaseUserRecordWithId extends BaseUserRecord {
  id: number | string
}

export interface AuthEnv {
  authClientId: string
  authOrganizationId: string
  authBaseUrl: string
  authIssuer: string
  authJwksEndpoint: string
  authServiceUser: string
  cmsBaseUrl: string
}

export type AuthProviderType = 'zitadel'

export interface CreateFirstUserConfig {
  createTenantData?: () => Record<string, unknown>
  tenantCollectionSlug: string
  userData: (params: {
    tenantId: number | string
    isFirstUser: boolean
    email: string
  }) => Record<string, unknown>
}

export type CanLoginResult
  = | {
    allowed: false
    reason: string
    status?: number
  }
  | {
    allowed: true
  }

export interface CreateZitadelAuthStrategyParams<TUser extends BaseUserRecord> {
  isUserAllowed: (user: TUser) => boolean
  /**
   * Makes an authorization decision after the Zitadel token and Payload user
   * have been validated. A denied result is returned as a public Payload API
   * error, preserving its reason and optional HTTP status.
   */
  canLogin?: (user: TUser) => CanLoginResult | Promise<CanLoginResult>
  /** Set to false to disable first-user bootstrapping. */
  createFirstUser?: false | CreateFirstUserConfig
  env: AuthEnv
  /** @default 'zitadel' */
  strategyName?: string
  userCollectionSlug: string
}

export interface CreateZitadelUserHookParams<TUser extends BaseUserRecord & TypeWithID> {
  env: AuthEnv
  /**
   * Payload operations that create a matching Zitadel user when one does not
   * already exist. Defaults to `['create']`.
   */
  operationsToCreate?: Array<'create' | 'update'>
  shouldSkip?: (args: Parameters<CollectionAfterChangeHook<TUser>>[0]) => boolean
  /**
   * URL used in ZITADEL's email verification message. It may contain
   * `{{.UserID}}`, `{{.OrgID}}`, and `{{.Code}}` placeholders.
   */
  verificationUrlTemplate?: string
}

export interface CreatePayloadCollectionAuthParams {
  lockTime?: number
  maxLoginAttempts?: number
  strategy: AuthStrategy
  tokenExpiration?: number
  verify?: boolean
}

export interface PublicAuthConfig {
  authClientId: string
  authOrganizationId: string
  authBaseUrl: string
  cmsBaseUrl: string
  provider: AuthProviderType
}

export interface CreateAuthStrategyParams<TUser extends BaseUserRecord> {
  isUserAllowed: (user: TUser) => boolean
  canLogin?: (user: TUser) => CanLoginResult | Promise<CanLoginResult>
  /** Set to false to disable first-user bootstrapping. */
  createFirstUser?: false | CreateFirstUserConfig
  /** @default 'zitadel' */
  strategyName?: string
  userCollectionSlug: string
}

export interface CreateAuthUserHookParams<TUser extends BaseUserRecord & TypeWithID> {
  /** @default ['create'] */
  operationsToCreate?: Array<'create' | 'update'>
  shouldSkip?: (args: Parameters<CollectionAfterChangeHook<TUser>>[0]) => boolean
  /**
   * URL used in ZITADEL's email verification message. It may contain
   * `{{.UserID}}`, `{{.OrgID}}`, and `{{.Code}}` placeholders.
   */
  verificationUrlTemplate?: string
}

export interface PayloadAuthProvider<TUser extends BaseUserRecord & TypeWithID> {
  createStrategy: (params: CreateAuthStrategyParams<TUser>) => AuthStrategy
  createUserHook: (params: CreateAuthUserHookParams<TUser>) => CollectionAfterChangeHook<TUser>
  getMiddlewareAuthConfig: () => Pick<PublicAuthConfig, 'authBaseUrl' | 'authClientId' | 'authOrganizationId' | 'provider'>
  getPublicConfig: () => PublicAuthConfig
}

export interface CreatePayloadAuthPluginParams<TUser extends BaseUserRecord & TypeWithID> {
  isUserAllowed: (user: TUser) => boolean
  authConfig?: Omit<CreatePayloadCollectionAuthParams, 'strategy'>
  canLogin?: (user: TUser) => CanLoginResult | Promise<CanLoginResult>
  /** Set to false to disable the default first-user bootstrap flow. */
  createFirstUser?: false | CreateFirstUserConfig
  /** @default ['create'] */
  operationsToCreate?: Array<'create' | 'update'>
  provider: PayloadAuthProvider<TUser>
  shouldSkipUserSync?: (args: Parameters<CollectionAfterChangeHook<TUser>>[0]) => boolean
  /** @default 'zitadel' */
  strategyName?: string
  tenantCollectionSlug: string
  tokenRefreshBufferMs?: number
  userCollectionSlug: string
  /** URL used in ZITADEL's email-verification message. */
  verificationUrlTemplate?: string
}

export interface PayloadAuthPluginResult {
  auth: PublicAuthConfig
  createCollectionAuth: (overrides?: Omit<CreatePayloadCollectionAuthParams, 'strategy'>) => ReturnType<typeof import('#plugin/payloadCollectionAuth.ts').createPayloadCollectionAuth>
  getCallbackViewProps: (overrides?: Partial<PublicAuthConfig>) => {
    clientId: string
    organizationId: string
    authBaseUrl: string
    cmsBaseUrl: string
    provider: AuthProviderType
  }
  getLoginButtonProps: (overrides?: Partial<PublicAuthConfig>) => {
    clientId: string
    organizationId: string
    authBaseUrl: string
    cmsBaseUrl: string
    provider: AuthProviderType
  }
  middleware: (middlewareState: Parameters<typeof import('#server/withPayloadTokenAuth.ts').withPayloadTokenAuth>[0]) => Promise<Awaited<ReturnType<typeof import('#server/withPayloadTokenAuth.ts').withPayloadTokenAuth>>>
  plugin: () => Plugin
  strategy: AuthStrategy
  userHook: CollectionAfterChangeHook<any>
}
