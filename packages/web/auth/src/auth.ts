import type { App } from 'vue'
import {
  computed,
  ref,
  shallowRef,
} from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { AUTH_CONTROLLER_KEY } from './auth.context'
import { createAuthRoutes } from './auth.routes'
import type {
  AuthController,
  AuthInstallOptions,
  AuthMessages,
  AuthNavigationRouter,
  CreateAuthOptions,
  ResolvedAuthProviderConfig,
} from './auth.type'
import { OidcClient } from './oidcClient'

interface AuthTransaction {
  createdAt: number
  providerKey: string
  redirectUrl: string
}

interface AuthStorageEvent {
  timestamp: number
  type: 'session-cleared'
}

const LEADING_AND_TRAILING_SLASHES = /^\/+|\/+$/g
const DEFAULT_MESSAGES: Required<AuthMessages> = {
  callbackDescription: 'Completing your sign in.',
  callbackTitle: 'Signing you in',
  loginDescription: 'Continue with your organization account.',
  loginTitle: 'Sign in',
  logoutDescription: 'Ending your current session.',
  logoutTitle: 'Signing you out',
  signInLabel: 'Sign in',
}

const AUTH_TRANSACTION_TTL_IN_MS = 15 * 60 * 1000

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getLocalStorage(): Storage | null {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage
}

function getSessionStorage(): Storage | null {
  if (!isBrowser()) {
    return null
  }

  return window.sessionStorage
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown auth error')
}

function isNetworkError(error: Error): boolean {
  if (!(error instanceof TypeError)) {
    return false
  }

  const normalizedMessage = error.message.toLowerCase()

  return normalizedMessage.includes('failed to fetch')
    || normalizedMessage.includes('load failed')
    || normalizedMessage.includes('networkerror')
}

function createRandomState(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2, 18)
}

function resolveRouteLocationPath(location: RouteLocationRaw): string {
  if (typeof location === 'string') {
    return location
  }

  if ('path' in location && typeof location.path === 'string') {
    return location.path
  }

  return '/'
}

function resolveNavigationPath(to: RouteLocationRaw): string {
  if (typeof to !== 'string' && 'fullPath' in to && typeof to.fullPath === 'string') {
    return to.fullPath
  }

  return resolveRouteLocationPath(to)
}

function normalizeRoutePath(path: string): string {
  const trimmedPath = path.trim()

  if (trimmedPath === '' || trimmedPath === '/') {
    return '/'
  }

  return `/${trimmedPath.replace(LEADING_AND_TRAILING_SLASHES, '')}`
}

function resolveChildRoutePath(basePath: string, childPath: string): string {
  if (childPath.startsWith('/')) {
    return normalizeRoutePath(childPath)
  }

  const normalizedBasePath = normalizeRoutePath(basePath)
  const normalizedChildPath = childPath.replace(LEADING_AND_TRAILING_SLASHES, '')

  if (normalizedChildPath === '') {
    return normalizedBasePath
  }

  if (normalizedBasePath === '/') {
    return `/${normalizedChildPath}`
  }

  return `${normalizedBasePath}/${normalizedChildPath}`
}

function appendQuery(path: string, query: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [
    key,
    value,
  ] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.set(key, value)
    }
  }

  const queryString = searchParams.toString()

  return queryString === '' ? path : `${path}?${queryString}`
}

function resolveStoragePrefix(options: Pick<CreateAuthOptions<never>, 'defaultProviderKey' | 'providers' | 'storagePrefix'>): string {
  if (options.storagePrefix !== undefined) {
    return options.storagePrefix
  }

  const defaultProvider = options.providers.find((provider) => provider.key === options.defaultProviderKey)

  if (defaultProvider !== undefined && 'oidc' in defaultProvider) {
    const providerPrefix = defaultProvider.oidc.prefix?.trim()

    if (providerPrefix !== undefined && providerPrefix.length > 0) {
      return providerPrefix
    }
  }

  return 'wisemen-auth'
}

function pruneTransactions(transactions: Record<string, AuthTransaction>): Record<string, AuthTransaction> {
  const now = Date.now()

  return Object.fromEntries(
    Object.entries(transactions).filter(([
      , transaction,
    ]) => now - transaction.createdAt <= AUTH_TRANSACTION_TTL_IN_MS),
  )
}

export function createAuth<TUser>(options: CreateAuthOptions<TUser>): AuthController<TUser> {
  const providers = options.providers.map((provider): ResolvedAuthProviderConfig => {
    if ('client' in provider) {
      return provider
    }

    return {
      ...provider,
      client: new OidcClient(provider.oidc),
    }
  })
  const providerMap = new Map<string, ResolvedAuthProviderConfig>(providers.map((provider) => [
    provider.key,
    provider,
  ]))

  if (!providerMap.has(options.defaultProviderKey)) {
    throw new Error(`Unknown default auth provider "${options.defaultProviderKey}"`)
  }

  const storagePrefix = resolveStoragePrefix(options)
  const activeProviderStorageKey = `${storagePrefix}:active-provider`
  const transactionStorageKey = `${storagePrefix}:transactions`
  const eventStorageKey = `${storagePrefix}:events`

  const currentUser = shallowRef<TUser | null>(null)
  const currentProviderKey = ref<string | null>(getLocalStorage()?.getItem(activeProviderStorageKey) ?? null)
  const isFetchingAuthUser = ref<boolean>(false)
  const hasAttemptedToFetchAuthUser = ref<boolean>(false)
  const isAuthenticated = computed<boolean>(() => currentUser.value !== null)
  const logoutCallbacks = new Set<() => void>()
  let boundRouter: AuthNavigationRouter | null = null
  let shouldNavigateWithBoundRouterOnLogout = true
  const messages: Required<AuthMessages> = {
    ...DEFAULT_MESSAGES,
    ...options.messages,
  }

  let currentUserPromise: Promise<TUser> | null = null

  function getProvider(providerKey: string): ResolvedAuthProviderConfig {
    const provider = providerMap.get(providerKey)

    if (provider === undefined) {
      throw new Error(`Unknown auth provider "${providerKey}"`)
    }

    return provider
  }

  function notifyUserChanged(user: TUser | null): Promise<void> {
    return Promise.resolve(options.onUserChanged?.(user))
  }

  async function resetUserState(user: TUser | null): Promise<void> {
    currentUser.value = user
    await notifyUserChanged(user)
  }

  function persistCurrentProviderKey(providerKey: string | null): void {
    currentProviderKey.value = providerKey

    const storage = getLocalStorage()

    if (storage === null) {
      return
    }

    if (providerKey === null) {
      storage.removeItem(activeProviderStorageKey)

      return
    }

    storage.setItem(activeProviderStorageKey, providerKey)
  }

  function readTransactions(): Record<string, AuthTransaction> {
    const storage = getSessionStorage()

    if (storage === null) {
      return {}
    }

    const serializedTransactions = storage.getItem(transactionStorageKey)

    if (serializedTransactions === null) {
      return {}
    }

    try {
      return JSON.parse(serializedTransactions) as Record<string, AuthTransaction>
    }
    catch {
      storage.removeItem(transactionStorageKey)

      return {}
    }
  }

  function writeTransactions(transactions: Record<string, AuthTransaction>): void {
    const storage = getSessionStorage()

    if (storage === null) {
      return
    }

    if (Object.keys(transactions).length === 0) {
      storage.removeItem(transactionStorageKey)

      return
    }

    storage.setItem(transactionStorageKey, JSON.stringify(transactions))
  }

  function createTransaction(providerKey: string, redirectUrl: string): string {
    const state = createRandomState()
    const transactions = pruneTransactions(readTransactions())

    transactions[state] = {
      createdAt: Date.now(),
      providerKey,
      redirectUrl,
    }

    writeTransactions(transactions)

    return state
  }

  function consumeTransaction(state: string): AuthTransaction | null {
    const transactions = pruneTransactions(readTransactions())
    const transaction = transactions[state] ?? null

    delete transactions[state]
    writeTransactions(transactions)

    return transaction
  }

  function broadcastSessionCleared(): void {
    const storage = getLocalStorage()

    if (storage === null) {
      return
    }

    const payload: AuthStorageEvent = {
      timestamp: Date.now(),
      type: 'session-cleared',
    }

    storage.setItem(eventStorageKey, JSON.stringify(payload))
    storage.removeItem(eventStorageKey)
  }

  async function applySessionCleared(notifyLogout: boolean): Promise<void> {
    currentUserPromise = null
    isFetchingAuthUser.value = false
    hasAttemptedToFetchAuthUser.value = false
    persistCurrentProviderKey(null)
    await resetUserState(null)

    if (notifyLogout) {
      for (const callback of logoutCallbacks) {
        callback()
      }

      if (boundRouter !== null && shouldNavigateWithBoundRouterOnLogout) {
        void boundRouter.replace(getLoginRouteLocation())
      }
    }
  }

  async function clearSession(options: {
    broadcast?: boolean
    notifyLogout?: boolean
  } = {}): Promise<void> {
    for (const provider of providers) {
      provider.client.logout()
    }

    await applySessionCleared(options.notifyLogout ?? true)

    if (options.broadcast !== false) {
      broadcastSessionCleared()
    }
  }

  async function resolveActiveProvider(): Promise<ResolvedAuthProviderConfig | null> {
    if (currentProviderKey.value !== null) {
      const currentProvider = providerMap.get(currentProviderKey.value)

      if (currentProvider !== undefined && await currentProvider.client.isLoggedIn()) {
        return currentProvider
      }
    }

    for (const provider of providers) {
      if (await provider.client.isLoggedIn()) {
        persistCurrentProviderKey(provider.key)

        return provider
      }
    }

    persistCurrentProviderKey(null)

    return null
  }

  async function getAuthUser(force = false): Promise<TUser> {
    if (!force && currentUser.value !== null) {
      return currentUser.value
    }

    if (currentUserPromise !== null) {
      return await currentUserPromise
    }

    currentUserPromise = (async (): Promise<TUser> => {
      const activeProvider = await resolveActiveProvider()

      if (activeProvider === null) {
        throw new Error('No authenticated session found')
      }

      isFetchingAuthUser.value = true

      try {
        const accessToken = await activeProvider.client.getAccessToken()
        const authUser = await options.fetchCurrentUser({
          accessToken,
          providerKey: activeProvider.key,
        })

        await resetUserState(authUser)
        hasAttemptedToFetchAuthUser.value = true

        return authUser
      }
      catch (error) {
        hasAttemptedToFetchAuthUser.value = true

        throw error
      }
      finally {
        isFetchingAuthUser.value = false
        currentUserPromise = null
      }
    })()

    return await currentUserPromise
  }

  function getCurrentUser(): TUser | null {
    return currentUser.value
  }

  function getCurrentUserOrThrow(): TUser {
    if (currentUser.value === null) {
      throw new Error('Authenticated user is not loaded')
    }

    return currentUser.value
  }

  async function getAccessToken(): Promise<string> {
    const activeProvider = await resolveActiveProvider()

    if (activeProvider === null) {
      throw new Error('No authenticated session found')
    }

    return await activeProvider.client.getAccessToken()
  }

  function getAuthenticatedRoute(): RouteLocationRaw {
    if (typeof options.defaultAuthenticatedRoute === 'function') {
      return options.defaultAuthenticatedRoute()
    }

    return options.defaultAuthenticatedRoute ?? {
      path: options.defaultRedirectPath ?? '/',
    }
  }

  function getLoginRouteLocation(redirectUrl?: string): RouteLocationRaw {
    const defaultProvider = getProvider(options.defaultProviderKey)

    if (redirectUrl === undefined) {
      return {
        name: defaultProvider.route.name,
      }
    }

    return {
      name: defaultProvider.route.name,
      query: {
        redirectUrl,
      },
    }
  }

  function getLoginPath(redirectUrl?: string): string {
    const defaultProvider = getProvider(options.defaultProviderKey)
    const basePath = options.routes?.basePath ?? '/auth'
    const loginPath = resolveChildRoutePath(basePath, defaultProvider.route.path)

    return appendQuery(loginPath, {
      redirectUrl,
    })
  }

  function getLogoutRouteLocation(): RouteLocationRaw {
    return {
      name: options.routes?.logoutName ?? 'auth-logout',
    }
  }

  async function getLoginUrl(providerKey = options.defaultProviderKey, redirectUrl?: string): Promise<string> {
    const provider = getProvider(providerKey)
    const fallbackRedirectPath = options.defaultRedirectPath ?? '/'
    const sanitizedRedirectUrl = provider.client.sanitizeRedirectUrl(
      redirectUrl ?? fallbackRedirectPath,
      fallbackRedirectPath,
    )
    const state = createTransaction(provider.key, sanitizedRedirectUrl)

    return await provider.client.getLoginUrl(undefined, {
      state,
    })
  }

  async function startLogin(providerKey = options.defaultProviderKey, redirectUrl?: string): Promise<void> {
    const loginUrl = await getLoginUrl(providerKey, redirectUrl)

    if (isBrowser()) {
      window.location.replace(loginUrl)
    }
  }

  async function handleCallback(code: string | null, state: string | null): Promise<string> {
    if (code === null) {
      throw new Error('Missing authorization code')
    }

    if (state === null) {
      throw new Error('Missing authentication state')
    }

    const transaction = consumeTransaction(state)

    if (transaction === null) {
      throw new Error('Invalid or expired authentication transaction')
    }

    const provider = getProvider(transaction.providerKey)

    try {
      await provider.client.loginWithCode(code)
      persistCurrentProviderKey(provider.key)
      await getAuthUser(true)

      return provider.client.sanitizeRedirectUrl(
        transaction.redirectUrl,
        options.defaultRedirectPath ?? '/',
      )
    }
    catch (error) {
      await clearSession({
        notifyLogout: false,
      })

      throw error
    }
  }

  async function isLoggedIn(): Promise<boolean> {
    return await resolveActiveProvider() !== null
  }

  async function logout(): Promise<void> {
    const activeProvider = await resolveActiveProvider()
    const logoutUrl = activeProvider?.client.getLogoutUrl() ?? null

    shouldNavigateWithBoundRouterOnLogout = false

    try {
      await clearSession()
    }
    finally {
      shouldNavigateWithBoundRouterOnLogout = true
    }

    if (!isBrowser()) {
      return
    }

    if (logoutUrl !== null) {
      window.location.replace(logoutUrl)

      return
    }

    window.location.replace(getLoginPath())
  }

  async function handleUnauthorized(): Promise<void> {
    await clearSession()
  }

  async function requireAuth(to: RouteLocationRaw, _from: RouteLocationRaw): Promise<RouteLocationRaw | undefined> {
    const redirectUrl = resolveNavigationPath(to)

    if (!await isLoggedIn()) {
      return getLoginRouteLocation(redirectUrl)
    }

    try {
      await getAuthUser()
    }
    catch (error) {
      const authError = toError(error)

      if (isNetworkError(authError) || options.shouldIgnoreCurrentUserError?.(authError) === true) {
        return
      }

      await handleUnauthorized()

      return getLoginRouteLocation()
    }
  }

  async function requireGuest(_to: RouteLocationRaw, _from: RouteLocationRaw): Promise<RouteLocationRaw | undefined> {
    if (!await isLoggedIn()) {
      return
    }

    try {
      await getAuthUser()
    }
    catch (error) {
      const authError = toError(error)

      if (isNetworkError(authError) || options.shouldIgnoreCurrentUserError?.(authError) === true) {
        return
      }

      await handleUnauthorized()

      return
    }

    return getAuthenticatedRoute()
  }

  function onLogout(callback: () => void): () => void {
    logoutCallbacks.add(callback)

    return () => {
      logoutCallbacks.delete(callback)
    }
  }

  if (isBrowser()) {
    window.addEventListener('storage', (event) => {
      if (event.key !== eventStorageKey || event.newValue === null) {
        return
      }

      void applySessionCleared(true)
    })
  }

  const auth = {
    hasAttemptedToFetchAuthUser,
    isAuthenticated,
    isFetchingAuthUser,
    isLoggedIn,
    currentProviderKey,
    currentUser,
    getAccessToken,
    getAuthenticatedRoute,
    getAuthUser: (): Promise<TUser> => getAuthUser(),
    getCurrentUser,
    getCurrentUserOrThrow,
    getLoginRouteLocation,
    getLoginUrl,
    getLogoutRouteLocation,
    handleCallback,
    handleUnauthorized,
    install: (app: App, installOptions?: AuthInstallOptions): void => {
      boundRouter = installOptions?.router ?? null
      app.provide(AUTH_CONTROLLER_KEY, auth as AuthController<unknown>)
    },
    logout,
    messages,
    providers,
    requireAuth,
    requireGuest,
    routes: [] as ReturnType<typeof createAuthRoutes<TUser>>,
    startLogin,
    user: currentUser,
    onLogout,
  } satisfies AuthController<TUser>

  auth.routes = createAuthRoutes(auth, options)

  return auth
}
