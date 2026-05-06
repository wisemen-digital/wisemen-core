import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  createApp,
  defineComponent,
} from 'vue'
import {
  createMemoryHistory,
  createRouter,
} from 'vue-router'

import { createAuth } from './auth'
import { INTERNAL_AUTH_CONTROLLER_KEY } from './auth.internal'

function createInstalledAuth(options: Parameters<typeof createAuth<{
  uuid: string
}>>[0]) {
  const auth = createAuth(options)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: defineComponent({
          name: 'HomeView',
          setup: () => () => null,
        }),
        meta: {
          public: true,
        },
      },
      {
        path: '/dashboard',
        component: defineComponent({
          name: 'DashboardView',
          setup: () => () => null,
        }),
      },
    ],
  })
  const app = createApp({
    name: 'AppRoot',
    setup: () => () => null,
  })

  auth.install(app, {
    router,
  })

  const internalAuth = (app as unknown as {
    _context: {
      provides: Record<PropertyKey, unknown>
    }
  })._context.provides[INTERNAL_AUTH_CONTROLLER_KEY as unknown as PropertyKey]

  if (internalAuth === undefined) {
    throw new Error('Expected internal auth controller to be provided')
  }

  return {
    auth,
    internalAuth: internalAuth as {
      completeLogin: (code: string | null, state: string | null) => Promise<string>
      startLogin: (providerKey?: string, redirectUrl?: string) => Promise<void>
    },
    router,
  }
}

function setStoredSession(prefix: string, providerKey: string, expiresAt = Date.now() + 60_000): void {
  localStorage.setItem(`${prefix}:provider`, providerKey)
  localStorage.setItem(`${prefix}:tokens`, JSON.stringify({
    accessToken: 'access-token',
    expiresAt,
    refreshToken: 'refresh-token',
  }))
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

describe('createAuth', () => {
  it('installs packaged auth routes and supports custom views', () => {
    const loginView = defineComponent({
      name: 'CustomLoginView',
      setup: () => () => null,
    })
    const callbackView = defineComponent({
      name: 'CustomCallbackView',
      setup: () => () => null,
    })
    const logoutView = defineComponent({
      name: 'CustomLogoutView',
      setup: () => () => null,
    })
    const {
      router,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(),
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
          path: 'login',
        },
        {
          autoStart: true,
          key: 'internal',
          path: 'wisemen',
        },
      ],
      views: {
        callback: callbackView,
        login: loginView,
        logout: logoutView,
      },
    })

    const loginRoute = router.getRoutes().find((route) => route.path === '/auth/login')
    const callbackRoute = router.getRoutes().find((route) => route.path === '/auth/callback')
    const logoutRoute = router.getRoutes().find((route) => route.path === '/auth/logout')
    const internalLoginRoute = router.getRoutes().find((route) => route.path === '/auth/wisemen')

    expect(loginRoute?.components?.default).toBe(loginView)
    expect(callbackRoute?.components?.default).toBe(callbackView)
    expect(logoutRoute?.components?.default).toBe(logoutView)
    expect(internalLoginRoute?.meta.authAutoStart).toBe(true)
  })

  it('redirects unauthenticated users from protected routes to the packaged login route', async () => {
    const {
      auth,
      router,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(),
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    await router.push('/dashboard')

    expect(router.currentRoute.value.fullPath).toBe('/auth/login?redirectUrl=/dashboard')
    expect(auth.isReady.value).toBe(true)
  })

  it('redirects authenticated users away from guest auth routes', async () => {
    const fetchCurrentUser = vi.fn(() => Promise.resolve({
      uuid: 'user-1',
    }))
    const {
      router,
    } = createInstalledAuth({
      defaultAuthenticatedRoute: {
        name: 'dashboard',
      },
      defaultProviderKey: 'default',
      fetchCurrentUser,
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    setStoredSession('wisemen-template', 'default')
    router.addRoute({
      name: 'dashboard',
      path: '/dashboard-home',
      component: defineComponent({
        name: 'DashboardHomeView',
        setup: () => () => null,
      }),
    })

    await router.push('/auth/login')

    expect(router.currentRoute.value.fullPath).toBe('/dashboard-home')
    expect(fetchCurrentUser).toHaveBeenCalledOnce()
  })

  it('starts and completes the login flow with transaction-backed state', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'access-token',
        expires_in: 3600,
        refresh_token: 'refresh-token',
      }),
    })))

    const replaceSpy = vi.spyOn(window.location, 'replace')
    const fetchCurrentUser = vi.fn(() => Promise.resolve({
      uuid: 'user-1',
    }))
    const {
      auth,
      internalAuth,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser,
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    await internalAuth.startLogin('default', '/dashboard')

    const serializedTransactions = sessionStorage.getItem('wisemen-template:transactions')

    if (serializedTransactions === null) {
      throw new Error('Expected auth transaction to be stored')
    }

    const transactionState = Object.keys(JSON.parse(serializedTransactions) as Record<string, unknown>)[0]
    const redirectUrl = await internalAuth.completeLogin('auth-code', transactionState)

    expect(replaceSpy).toHaveBeenCalledOnce()
    expect(redirectUrl).toBe('/dashboard')
    expect(fetchCurrentUser).toHaveBeenCalledWith({
      accessToken: 'access-token',
      providerKey: 'default',
    })
    expect(auth.user.value).toEqual({
      uuid: 'user-1',
    })
  })

  it('keeps the session when current-user hydration fails with an ignored network error', async () => {
    const {
      auth,
      router,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    setStoredSession('wisemen-template', 'default')

    await router.push('/dashboard')

    expect(router.currentRoute.value.fullPath).toBe('/dashboard')
    expect(localStorage.getItem('wisemen-template:provider')).toBe('default')
    expect(auth.user.value).toBeNull()
    expect(auth.isReady.value).toBe(false)
  })

  it('refreshes expired access tokens through the public getAccessToken API', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'refreshed-access-token',
        expires_in: 3600,
        refresh_token: 'refreshed-refresh-token',
      }),
    })))

    const {
      auth,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(),
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    setStoredSession('wisemen-template', 'default', Date.now() - 1_000)

    await expect(auth.getAccessToken()).resolves.toBe('refreshed-access-token')
    expect(localStorage.getItem('wisemen-template:tokens')).toContain('refreshed-access-token')
  })

  it('clears local session state and redirects to the identity provider logout endpoint', async () => {
    const replaceSpy = vi.spyOn(window.location, 'replace')
    const {
      auth,
    } = createInstalledAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(),
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: [
          '/auth/*',
        ],
        clientId: 'client-id',
        loginRedirectUri: 'https://app.example.com/auth/callback',
        postLogoutRedirectUri: 'https://app.example.com/auth/logout',
        prefix: 'wisemen-template',
        scopes: [
          'openid',
        ],
      },
      providers: [
        {
          key: 'default',
        },
      ],
    })

    setStoredSession('wisemen-template', 'default')

    await auth.logout()

    expect(localStorage.getItem('wisemen-template:provider')).toBeNull()
    expect(localStorage.getItem('wisemen-template:tokens')).toBeNull()
    expect(replaceSpy).toHaveBeenCalledWith('https://auth.example.com/oidc/v1/end_session?client_id=client-id&post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth%2Flogout')
  })
})
