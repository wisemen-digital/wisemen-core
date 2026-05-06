import type { App } from 'vue'
import {
  ref,
  shallowRef,
} from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordRaw,
  Router,
} from 'vue-router'

import {
  getAuthRouteConfig,
  getDefaultMessages,
  INTERNAL_AUTH_CONTROLLER_KEY,
  joinPaths,
} from './auth.internal'
import type {
  Auth,
  AuthInstallOptions,
  CreateAuthOptions,
} from './auth.type'
import { AuthSessionEventStore, AuthTransactionStore } from './auth.storage'
import { DefaultAuthCallbackView, DefaultAuthLoginView, DefaultAuthLogoutView } from './auth.views'
import { OidcClient } from './oidc.internal'

function getError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown auth error')
}

function isNetworkError(error: Error): boolean {
  if (!(error instanceof TypeError)) {
    return false
  }

  const message = error.message.toLowerCase()

  return message.includes('failed to fetch')
    || message.includes('load failed')
    || message.includes('networkerror')
}

function getNavigationPath(location: RouteLocationRaw): string {
  if (typeof location === 'string') {
    return location
  }

  if ('fullPath' in location && typeof location.fullPath === 'string') {
    return location.fullPath
  }

  if ('path' in location && typeof location.path === 'string') {
    return location.path
  }

  return '/'
}

export function createAuth<TUser>(options: CreateAuthOptions<TUser>): Auth<TUser> {
  const messages = getDefaultMessages(options.messages)
  const routeConfig = getAuthRouteConfig(options)
  const storagePrefix = options.oidc.prefix?.trim() || 'wisemen-auth'
  const currentProviderStorageKey = `${storagePrefix}:provider`
  const transactionStore = new AuthTransactionStore(`${storagePrefix}:transactions`)
  const sessionEventStore = new AuthSessionEventStore(`${storagePrefix}:events`)

  const providers = options.providers.map((provider) => ({
    autoStart: provider.autoStart === true,
    key: provider.key,
    label: provider.label || messages.signInLabel,
    loginPath: provider.path ?? (provider.key === options.defaultProviderKey ? 'login' : provider.key),
    loginRoutePath: '',
    client: new OidcClient(options.oidc, {
      scopes: Array.from(new Set([
        ...options.oidc.scopes,
        ...(provider.scopes ?? []),
      ])),
    }),
  }))
    .map((provider) => ({
      ...provider,
      loginRoutePath: joinPaths(routeConfig.authBasePath, provider.loginPath),
    }))

  const defaultProvider = providers.find((provider) => provider.key === options.defaultProviderKey)

  if (defaultProvider === undefined) {
    throw new Error(`Unknown default auth provider "${options.defaultProviderKey}"`)
  }

  const defaultAuthProvider = defaultProvider
  const providerMap = new Map(providers.map((provider) => [
    provider.key,
    provider,
  ]))

  const user = shallowRef<TUser | null>(null)
  const isReady = ref(false)

  let currentUserPromise: Promise<TUser> | null = null
  let installedRouter: Router | null = null
  let isInstalled = false
  let logoutPromise: Promise<void> | null = null

  function getLocalStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage
  }

  function getProvider(providerKey: string) {
    const provider = providerMap.get(providerKey)

    if (provider === undefined) {
      throw new Error(`Unknown auth provider "${providerKey}"`)
    }

    return provider
  }

  function getAuthenticatedRoute(): RouteLocationRaw {
    if (typeof options.defaultAuthenticatedRoute === 'function') {
      return options.defaultAuthenticatedRoute()
    }

    return options.defaultAuthenticatedRoute ?? {
      path: routeConfig.defaultRedirectPath,
    }
  }

  function getLoginRouteLocation(redirectUrl?: string): RouteLocationRaw {
    if (redirectUrl === undefined) {
      return {
        path: defaultAuthProvider.loginRoutePath,
      }
    }

    return {
      path: defaultAuthProvider.loginRoutePath,
      query: {
        redirectUrl,
      },
    }
  }

  function persistCurrentProviderKey(providerKey: string | null): void {
    const storage = getLocalStorage()

    if (storage === null) {
      return
    }

    if (providerKey === null) {
      storage.removeItem(currentProviderStorageKey)

      return
    }

    storage.setItem(currentProviderStorageKey, providerKey)
  }

  async function notifyUserChanged(nextUser: TUser | null): Promise<void> {
    user.value = nextUser
    await Promise.resolve(options.onUserChanged?.(nextUser))
  }

  function shouldIgnoreUserError(error: Error): boolean {
    return isNetworkError(error) || options.shouldIgnoreCurrentUserError?.(error) === true
  }

  async function clearSession(sessionOptions: {
    broadcast?: boolean
    navigate?: boolean
  } = {}): Promise<void> {
    for (const provider of providers) {
      provider.client.clear()
    }

    currentUserPromise = null
    persistCurrentProviderKey(null)
    await notifyUserChanged(null)
    isReady.value = true

    if (sessionOptions.broadcast !== false) {
      sessionEventStore.broadcastSessionCleared()
    }

    if (sessionOptions.navigate !== false && installedRouter !== null) {
      void installedRouter.replace(getLoginRouteLocation())
    }
  }

  async function resolveActiveProvider(): Promise<(typeof providers)[number] | null> {
    const storedProviderKey = getLocalStorage()?.getItem(currentProviderStorageKey) ?? null

    if (storedProviderKey !== null) {
      const storedProvider = providerMap.get(storedProviderKey)

      if (storedProvider !== undefined && await storedProvider.client.hasSession()) {
        return storedProvider
      }
    }

    for (const provider of providers) {
      if (await provider.client.hasSession()) {
        persistCurrentProviderKey(provider.key)

        return provider
      }
    }

    persistCurrentProviderKey(null)

    return null
  }

  async function ensureUserLoaded(force = false): Promise<TUser> {
    if (!force && user.value !== null) {
      isReady.value = true

      return user.value
    }

    if (currentUserPromise !== null) {
      return await currentUserPromise
    }

    currentUserPromise = (async () => {
      const activeProvider = await resolveActiveProvider()

      if (activeProvider === null) {
        throw new Error('No authenticated session found')
      }

      isReady.value = false

      const accessToken = await activeProvider.client.getAccessToken()
      const authUser = await options.fetchCurrentUser({
        accessToken,
        providerKey: activeProvider.key,
      })

      persistCurrentProviderKey(activeProvider.key)
      await notifyUserChanged(authUser)
      isReady.value = true

      return authUser
    })()
      .catch((error: unknown) => {
        const authError = getError(error)

        if (user.value !== null && shouldIgnoreUserError(authError)) {
          isReady.value = true

          return user.value
        }

        throw authError
      })
      .finally(() => {
        currentUserPromise = null
      })

    return await currentUserPromise
  }

  async function startLogin(providerKey = options.defaultProviderKey, redirectUrl?: string): Promise<void> {
    const provider = getProvider(providerKey)
    const nextRedirectUrl = provider.client.sanitizeRedirectUrl(
      redirectUrl ?? routeConfig.defaultRedirectPath,
      routeConfig.defaultRedirectPath,
    )
    const state = transactionStore.create(provider.key, nextRedirectUrl)
    const loginUrl = await provider.client.getLoginUrl(state)

    if (typeof window !== 'undefined') {
      window.location.replace(loginUrl)
    }
  }

  async function completeLogin(code: string | null, state: string | null): Promise<string> {
    if (code === null) {
      throw new Error('Missing authorization code')
    }

    if (state === null) {
      throw new Error('Missing authentication state')
    }

    const transaction = transactionStore.consume(state)

    if (transaction === null) {
      throw new Error('Invalid or expired authentication transaction')
    }

    const provider = getProvider(transaction.providerKey)

    try {
      await provider.client.loginWithCode(code)
      persistCurrentProviderKey(provider.key)

      try {
        await ensureUserLoaded(true)
      }
      catch (error) {
        if (!shouldIgnoreUserError(getError(error))) {
          throw error
        }
      }

      return provider.client.sanitizeRedirectUrl(transaction.redirectUrl, routeConfig.defaultRedirectPath)
    }
    catch (error) {
      await clearSession({
        broadcast: false,
        navigate: false,
      })

      throw error
    }
  }

  async function logout(): Promise<void> {
    if (logoutPromise !== null) {
      return await logoutPromise
    }

    logoutPromise = (async () => {
      const activeProvider = await resolveActiveProvider()
      const logoutUrl = activeProvider?.client.getLogoutUrl() ?? null

      await clearSession({
        navigate: false,
      })

      if (typeof window === 'undefined') {
        return
      }

      window.location.replace(logoutUrl ?? defaultAuthProvider.loginRoutePath)
    })()
      .finally(() => {
        logoutPromise = null
      })

    return await logoutPromise
  }

  function isPublicRoute(to: RouteLocationNormalized): boolean {
    return to.matched.some((route) => route.meta.public === true)
  }

  async function handleGuestRoute(): Promise<RouteLocationRaw | undefined> {
    const activeProvider = await resolveActiveProvider()

    if (activeProvider === null) {
      isReady.value = true

      return
    }

    try {
      await ensureUserLoaded()

      return getAuthenticatedRoute()
    }
    catch (error) {
      if (shouldIgnoreUserError(getError(error))) {
        return
      }

      await clearSession({
        navigate: false,
      })
    }
  }

  async function guard(to: RouteLocationNormalized): Promise<RouteLocationRaw | undefined> {
    if (isPublicRoute(to)) {
      const guestRoute = to.matched.some((route) => route.meta.authProviderKey !== undefined)

      if (!guestRoute) {
        isReady.value = true

        return
      }

      return await handleGuestRoute()
    }

    const activeProvider = await resolveActiveProvider()

    if (activeProvider === null) {
      isReady.value = true

      return getLoginRouteLocation(getNavigationPath(to))
    }

    try {
      await ensureUserLoaded()
    }
    catch (error) {
      const authError = getError(error)

      if (shouldIgnoreUserError(authError)) {
        return
      }

      await clearSession({
        navigate: false,
      })

      return getLoginRouteLocation()
    }
  }

  function createRoutes(): RouteRecordRaw[] {
    return [
      {
        path: routeConfig.authBasePath,
        redirect: defaultAuthProvider.loginRoutePath,
        meta: {
          public: true,
        },
      },
      ...providers.map((provider) => ({
        path: provider.loginRoutePath,
        component: options.views?.login ?? DefaultAuthLoginView,
        meta: {
          authAutoStart: provider.autoStart,
          authProviderKey: provider.key,
          public: true,
        },
      })),
      {
        path: routeConfig.callbackRoutePath,
        component: options.views?.callback ?? DefaultAuthCallbackView,
        meta: {
          public: true,
        },
      },
      {
        path: routeConfig.logoutRoutePath,
        component: options.views?.logout ?? DefaultAuthLogoutView,
        meta: {
          public: true,
        },
      },
    ]
  }

  const internalAuth = {
    completeLogin,
    getAuthenticatedRoute,
    getLoginRouteLocation,
    logout,
    messages,
    providers,
    startLogin,
  }

  return {
    user,
    isReady,
    getAccessToken: async (): Promise<string> => {
      const activeProvider = await resolveActiveProvider()

      if (activeProvider === null) {
        throw new Error('No authenticated session found')
      }

      return await activeProvider.client.getAccessToken()
    },
    install: (app: App, installOptions: AuthInstallOptions): void => {
      if (!isInstalled) {
        installedRouter = installOptions.router

        for (const route of createRoutes()) {
          installOptions.router.addRoute(route)
        }

        installOptions.router.beforeEach((to) => guard(to))
        sessionEventStore.listen(() => {
          void clearSession({
            broadcast: false,
          })
        })
        isInstalled = true
      }
      else if (installedRouter !== installOptions.router) {
        throw new Error('Auth plugin is already installed with a different router')
      }

      app.provide(INTERNAL_AUTH_CONTROLLER_KEY, internalAuth)
    },
    logout,
  } satisfies Auth<TUser>
}
