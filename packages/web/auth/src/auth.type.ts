import type {
  App,
  Component,
  Ref,
  ShallowRef,
} from 'vue'
import type {
  RouteLocationRaw,
  Router,
} from 'vue-router'

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

export interface AuthOidcConfig {
  allowedPaths?: string[]
  baseUrl: string
  blockedPaths?: string[]
  clientId: string
  loginRedirectUri: string
  postLogoutRedirectUri: string
  prefix?: string
  scopes: string[]
}

export interface AuthProviderConfig {
  autoStart?: boolean
  key: string
  label?: string
  path?: string
  scopes?: string[]
}

export interface AuthRoutesConfig {
  basePath?: string
  callbackPath?: string
  logoutPath?: string
}

export interface AuthViewOverrides {
  callback?: Component
  login?: Component
  logout?: Component
}

export interface CreateAuthOptions<TUser> {
  defaultAuthenticatedRoute?: RouteLocationRaw | (() => RouteLocationRaw)
  defaultProviderKey: string
  defaultRedirectPath?: string
  fetchCurrentUser: (context: AuthFetchCurrentUserContext) => Promise<TUser>
  messages?: AuthMessages
  oidc: AuthOidcConfig
  onUserChanged?: (user: TUser | null) => Promise<void> | void
  providers: AuthProviderConfig[]
  routes?: AuthRoutesConfig
  shouldIgnoreCurrentUserError?: (error: Error) => boolean
  views?: AuthViewOverrides
}

export interface AuthInstallOptions {
  router: Router
}

export interface Auth<TUser> {
  install: (app: App, options: AuthInstallOptions) => void
  isReady: Readonly<Ref<boolean>>
  getAccessToken: () => Promise<string>
  logout: () => Promise<void>
  user: ShallowRef<TUser | null>
}
