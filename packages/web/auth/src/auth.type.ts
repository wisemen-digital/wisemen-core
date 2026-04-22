import type {
  App,
  Component,
  ComputedRef,
  Ref,
} from 'vue'
import type {
  RouteLocationRaw,
  RouteRecordRaw,
} from 'vue-router'

import type { OAuth2VueClientOptions } from './oidc.type'
import type { OidcClient } from './oidcClient'

type MaybePromise<T> = Promise<T> | T

export interface AuthProviderRouteConfig {
  name: string
  autoStart?: boolean
  path: string
}

type AuthProviderClient = Pick<
  OidcClient,
  'getAccessToken' | 'getLoginUrl' | 'getLogoutUrl' | 'isLoggedIn' | 'loginWithCode' | 'logout' | 'sanitizeRedirectUrl'
>

interface AuthProviderBaseConfig {
  description?: string
  key: string
  label?: string
  route: AuthProviderRouteConfig
}

export type AuthProviderConfig = AuthProviderBaseConfig & ({
  client: AuthProviderClient
} | {
  oidc: OAuth2VueClientOptions
})

export interface ResolvedAuthProviderConfig extends AuthProviderBaseConfig {
  client: AuthProviderClient
}

export interface AuthFetchCurrentUserContext {
  accessToken: string
  providerKey: string
}

export interface AuthMessages {
  callbackDescription?: string
  callbackTitle?: string
  loginDescription?: string
  loginTitle?: string
  logoutDescription?: string
  logoutTitle?: string
  signInLabel?: string
}

export interface AuthRouteConfig {
  basePath?: string
  callbackName?: string
  callbackPath?: string
  logoutName?: string
  logoutPath?: string
}

export interface AuthViewOverrides {
  callback?: Component
  login?: Component
  logout?: Component
}

export interface AuthNavigationRouter {
  replace: (to: RouteLocationRaw) => unknown
}

export interface AuthInstallOptions {
  router?: AuthNavigationRouter
}

export interface CreateAuthOptions<TUser> {
  defaultAuthenticatedRoute?: (() => RouteLocationRaw) | RouteLocationRaw
  defaultProviderKey: string
  defaultRedirectPath?: string
  fetchCurrentUser: (context: AuthFetchCurrentUserContext) => Promise<TUser>
  messages?: AuthMessages
  providers: AuthProviderConfig[]
  routes?: AuthRouteConfig
  shouldIgnoreCurrentUserError?: (error: Error) => boolean
  storagePrefix?: string
  views?: AuthViewOverrides
  onUserChanged?: (user: TUser | null) => MaybePromise<void>
}

export interface AuthController<TUser> {
  hasAttemptedToFetchAuthUser: Ref<boolean>
  isAuthenticated: ComputedRef<boolean>
  isFetchingAuthUser: Ref<boolean>
  isLoggedIn: () => Promise<boolean>
  currentProviderKey: Ref<string | null>
  currentUser: Ref<TUser | null>
  getAccessToken: () => Promise<string>
  getAuthenticatedRoute: () => RouteLocationRaw
  getAuthUser: () => Promise<TUser>
  getCurrentUser: () => TUser | null
  getCurrentUserOrThrow: () => TUser
  getLoginRouteLocation: (redirectUrl?: string) => RouteLocationRaw
  getLoginUrl: (providerKey?: string, redirectUrl?: string) => Promise<string>
  getLogoutRouteLocation: () => RouteLocationRaw
  handleCallback: (code: string | null, state: string | null) => Promise<string>
  handleUnauthorized: () => Promise<void>
  install: (app: App, options?: AuthInstallOptions) => void
  logout: () => Promise<void>
  messages: Required<AuthMessages>
  providers: readonly ResolvedAuthProviderConfig[]
  requireAuth: (to: RouteLocationRaw, from: RouteLocationRaw) => Promise<RouteLocationRaw | undefined>
  requireGuest: (to: RouteLocationRaw, from: RouteLocationRaw) => Promise<RouteLocationRaw | undefined>
  routes: RouteRecordRaw[]
  startLogin: (providerKey?: string, redirectUrl?: string) => Promise<void>
  user: Ref<TUser | null>
  onLogout: (callback: () => void) => () => void
}

export interface AuthRouteMeta {
  authAutoStart?: boolean
  authProviderKey?: string
}
