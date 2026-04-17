import type {
  ComputedRef,
  Ref,
  ShallowRef,
} from 'vue'

import type { MiddlewareFn } from '../middleware/middleware.type'
import type { OidcClient } from '../oidcClient'
import type { TokensStrategy } from '../tokens-strategy/tokensStrategy.type'

/**
 * Minimal router interface to avoid version coupling with vue-router.
 */
export interface AuthRouterLike {
  beforeEach: (guard: (to: any, from: any) => any) => any
}

export interface AuthPluginOptions<TUser> {
  /**
   * The OAuth2 client ID.
   */
  clientId: string

  /**
   * The base URL of the OAuth2 server.
   */
  baseUrl: string

  /**
   * Fetch the authenticated user from your API.
   * Called after login and when the auth middleware runs.
   * Should throw on error (e.g., 401).
   */
  fetchUser: () => Promise<TUser>

  /**
   * The URL to redirect to after login.
   */
  loginRedirectUri: string

  /**
   * If true, bypasses authentication (for testing/E2E).
   */
  offline?: boolean

  /**
   * Permission configuration.
   */
  permissions?: {
    /** Key that grants all permissions (e.g., 'all_permissions') */
    allKey?: string
    /** Extract permission keys from the user object */
    resolver: (user: TUser) => string[]
  }

  /**
   * The URL to redirect to after logout.
   */
  postLogoutRedirectUri: string

  /**
   * Prefix for localStorage keys. Useful to avoid collisions between multiple apps.
   */
  prefix?: string

  /**
   * Redirect URL validation configuration.
   */
  redirects?: {
    allowedPaths?: string[]
    blockedPaths?: string[]
  }

  /**
   * Route names used for auth navigation.
   */
  routes: {
    /** Home/dashboard route name (redirect target after login) */
    home: string
    /** Login page route name */
    login: string
    /** No permission page route name */
    noPermission?: string
  }

  /**
   * The scopes to request from the OAuth2 server.
   */
  scopes: string[]

  /**
   * Custom token storage strategy.
   */
  tokensStrategy?: TokensStrategy

  /**
   * Called when the authenticated user changes (login/logout).
   */
  onUserChanged?: (user: TUser | null) => void
}

export interface AuthPlugin<TUser> {
  /** Whether at least one fetch attempt has been made */
  hasAttemptedFetch: Ref<boolean>

  /** Check if the current user has the given permission(s). */
  hasPermission: (permission: string | string[]) => boolean

  /** Computed boolean indicating if user is authenticated */
  isAuthenticated: ComputedRef<boolean>

  /** Whether the auth user is currently being fetched */
  isLoading: Ref<boolean>

  /** Check if the user has a valid session. */
  isLoggedIn: () => Promise<boolean>

  /** Auth route middleware - protects authenticated routes. */
  authMiddleware: MiddlewareFn

  /** The underlying OidcClient instance */
  client: OidcClient

  /** Fetch and cache the authenticated user. Returns cached user if already fetched. */
  fetchUser: () => Promise<TUser>

  /** Get a valid access token (refreshes if needed). */
  getAccessToken: () => Promise<string>

  /** Get the OAuth login URL for a specific identity provider (e.g. social login). */
  getIdentityProviderLoginUrl: (idpId: string) => Promise<string>

  /** Get the OAuth login URL. */
  getLoginUrl: (redirectUrl?: string, scopes?: string[]) => Promise<string>

  /** Get the OAuth logout URL. */
  getLogoutUrl: () => string

  /** Returns the authenticated user or throws if not authenticated. */
  getUserOrThrow: () => TUser

  /** Guest route middleware - redirects authenticated users away from login. */
  guestMiddleware: MiddlewareFn

  /** Install as Vue plugin (no-op, state is module-level) */
  install: (app: unknown) => void

  /** Exchange an authorization code for tokens. */
  loginWithCode: (code: string) => Promise<void>

  /** Clear tokens and auth state, execute logout callbacks. */
  logout: () => void

  /** Force re-fetch the authenticated user from the API. */
  refetchUser: () => Promise<TUser>

  /** The configured route names, as passed to createAuth(). */
  routes: Readonly<{
    home: string
    login: string
    noPermission?: string
  }>

  /** Sanitize a redirect URL for safety. */
  sanitizeRedirectUrl: (url: string, fallback?: string) => string

  /** Setup router guards (middleware execution + permission checking). */
  setupRouter: (router: AuthRouterLike) => void

  /** Manually set the authenticated user. */
  setUser: (user: TUser | null) => void

  /** Reactive reference to the authenticated user */
  user: ShallowRef<TUser | null>

  /** Register a callback to execute on logout. Returns an unsubscribe function. */
  onLogout: (callback: () => void) => () => void
}
