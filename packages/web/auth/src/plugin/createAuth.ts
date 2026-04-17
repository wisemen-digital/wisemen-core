import {
  computed,
  ref,
  shallowRef,
} from 'vue'

import type { MiddlewareFn } from '../middleware/middleware.type'
import { OidcClient } from '../oidcClient'
import type {
  AuthPlugin,
  AuthPluginOptions,
  AuthRouterLike,
} from './authPlugin.type'

let _instance: AuthPlugin<any> | null = null

/**
 * Get the current auth plugin instance.
 * Throws if `createAuth()` has not been called yet.
 */
export function getAuthInstance<TUser = unknown>(): AuthPlugin<TUser> {
  if (_instance === null) {
    throw new Error('Auth plugin not initialized. Call createAuth() first.')
  }

  return _instance as AuthPlugin<TUser>
}

function warnIfDev(message: string): void {
  if (import.meta.env?.MODE !== 'production') {
    console.warn(`[vue-core-auth] ${message}`)
  }
}

/**
 * Create an auth plugin instance that manages the full OAuth2/OIDC lifecycle.
 *
 * This is a singleton — only one instance should be created per application.
 * Provides reactive auth state, route middleware, permission checking,
 * and router guard setup.
 */
export function createAuth<TUser>(options: AuthPluginOptions<TUser>): AuthPlugin<TUser> {
  if (_instance !== null) {
    warnIfDev('createAuth() was called more than once. The previous instance will be replaced.')
  }

  const client = new OidcClient({
    clientId: options.clientId,
    allowedPaths: options.redirects?.allowedPaths,
    baseUrl: options.baseUrl,
    blockedPaths: options.redirects?.blockedPaths,
    loginRedirectUri: options.loginRedirectUri,
    offline: options.offline,
    postLogoutRedirectUri: options.postLogoutRedirectUri,
    prefix: options.prefix,
    scopes: options.scopes,
    tokensStrategy: options.tokensStrategy,
  })

  // Reactive state
  const user = shallowRef<TUser | null>(null)
  const isLoading = ref(false)
  const hasAttemptedFetch = ref(false)
  const isAuthenticated = computed<boolean>(() => user.value !== null)
  const logoutCallbacks: Array<() => void> = []

  function setUser(updatedUser: TUser | null): void {
    user.value = updatedUser
    options.onUserChanged?.(updatedUser)
  }

  async function doFetchUser(): Promise<TUser> {
    isLoading.value = true

    try {
      const fetchedUser = await options.fetchUser()

      setUser(fetchedUser)
      hasAttemptedFetch.value = true

      return fetchedUser
    }
    catch (error) {
      hasAttemptedFetch.value = true

      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  let _fetchUserPromise: Promise<TUser> | null = null

  function fetchUser(): Promise<TUser> {
    if (user.value !== null) {
      return Promise.resolve(user.value)
    }

    if (_fetchUserPromise !== null) {
      return _fetchUserPromise
    }

    _fetchUserPromise = doFetchUser().finally(() => {
      _fetchUserPromise = null
    })

    return _fetchUserPromise
  }

  function refetchUser(): Promise<TUser> {
    return doFetchUser()
  }

  function getUserOrThrow(): TUser {
    if (user.value === null) {
      throw new Error('Auth user is not set')
    }

    return user.value
  }

  function logout(): void {
    client.logout()
    setUser(null)

    for (const cb of logoutCallbacks) {
      try {
        cb()
      }
      catch (error) {
        warnIfDev(`Logout callback threw: ${error}`)
      }
    }
  }

  function onLogout(callback: () => void): () => void {
    logoutCallbacks.push(callback)

    return () => {
      const index = logoutCallbacks.indexOf(callback)

      if (index !== -1) {
        logoutCallbacks.splice(index, 1)
      }
    }
  }

  function hasPermission(permission: string | string[]): boolean {
    if (options.permissions === undefined) {
      return true
    }

    if (user.value === null) {
      return false
    }

    const userPermissions = options.permissions.resolver(user.value)
    const allKey = options.permissions.allKey

    if (allKey !== undefined && userPermissions.includes(allKey)) {
      return true
    }

    const permissionsToCheck = Array.isArray(permission)
      ? permission
      : [
          permission,
        ]

    return permissionsToCheck.some((p) => userPermissions.includes(p))
  }

  // Auth middleware: protects routes that require authentication
  async function authMiddleware(to?: any): Promise<Record<string, unknown> | undefined> {
    const loggedIn = await client.isLoggedIn()

    if (!loggedIn) {
      return {
        name: options.routes.login,
        query: {
          redirectUrl: to?.fullPath ?? (window.location.pathname + window.location.search + window.location.hash),
        },
      }
    }

    try {
      await fetchUser()
    }
    catch {
      logout()

      return {
        name: options.routes.login,
      }
    }
  }

  // Guest middleware: redirects authenticated users away from login pages
  async function guestMiddleware(): Promise<Record<string, unknown> | undefined> {
    const loggedIn = await client.isLoggedIn()

    if (loggedIn) {
      return {
        name: options.routes.home,
      }
    }
  }

  function setupRouter(router: AuthRouterLike): void {
    router.beforeEach(async (to: any, from: any) => {
      // Execute route middleware
      const middlewares = (to.matched ?? [])
        .filter((record: any) => record.meta?.middleware != null)
        .flatMap((record: any) => record.meta.middleware as MiddlewareFn[])

      for (const middleware of middlewares) {
        const result = await middleware(to, from)

        if (result != null) {
          return result
        }
      }

      // Check route permissions
      if (options.routes.noPermission !== undefined) {
        const permissions = (to.matched ?? [])
          .filter((record: any) => record.meta?.permission != null)
          .flatMap((record: any) => {
            const p = record.meta.permission as string | string[]

            return Array.isArray(p)
              ? p
              : [
                  p,
                ]
          })

        if (permissions.length > 0 && !hasPermission(permissions)) {
          return {
            name: options.routes.noPermission,
          }
        }
      }
    })
  }

  const plugin: AuthPlugin<TUser> = {
    hasAttemptedFetch,
    hasPermission,
    isAuthenticated,
    isLoading,
    isLoggedIn: () => client.isLoggedIn(),
    authMiddleware,
    client,
    fetchUser,
    getAccessToken: () => client.getAccessToken(),
    getIdentityProviderLoginUrl: (idpId: string) => client.getIdentityProviderLoginUrl(idpId),
    getLoginUrl: (redirectUrl?: string, scopes?: string[]) => client.getLoginUrl(redirectUrl, scopes),
    getLogoutUrl: () => client.getLogoutUrl(),
    getUserOrThrow,
    guestMiddleware,
    install: () => {},
    loginWithCode: (code: string) => client.loginWithCode(code),
    logout,
    refetchUser,
    routes: Object.freeze({
      home: options.routes.home,
      login: options.routes.login,
      noPermission: options.routes.noPermission,
    }),
    sanitizeRedirectUrl: (url: string, fallback?: string) => client.sanitizeRedirectUrl(url, fallback),
    setupRouter,
    setUser,
    user,
    onLogout,
  }

  _instance = plugin

  return plugin
}
