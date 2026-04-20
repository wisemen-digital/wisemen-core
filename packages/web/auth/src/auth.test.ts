import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

import { createAuth } from './auth'

function getPackagedAuthChildren(route: RouteRecordRaw): NonNullable<RouteRecordRaw['children']> {
  if (route.children === undefined) {
    throw new Error('Expected packaged auth root route to include child routes')
  }

  return route.children
}

function getGuestGuard(route: RouteRecordRaw): Exclude<RouteRecordRaw['beforeEnter'], RouteRecordRaw['beforeEnter'][] | undefined> {
  if (route.beforeEnter === undefined || Array.isArray(route.beforeEnter)) {
    throw new Error('Expected packaged login route to use a single guest guard')
  }

  return route.beforeEnter
}

function getRouteByName(children: RouteRecordRaw[], routeName: string): RouteRecordRaw {
  const route = children.find((child) => child.name === routeName)

  if (route === undefined) {
    throw new Error(`Expected packaged auth root route to include the "${routeName}" route`)
  }

  return route
}

function invokeGuestGuard(
  guard: Exclude<RouteRecordRaw['beforeEnter'], RouteRecordRaw['beforeEnter'][] | undefined>,
): ReturnType<Exclude<RouteRecordRaw['beforeEnter'], RouteRecordRaw['beforeEnter'][] | undefined>> {
  return Reflect.apply(guard, undefined, [
    {
      fullPath: '/auth/login',
      path: '/auth/login',
    } as never,
    {
      path: '/',
    } as never,
    (() => {}) as never,
  ]) as ReturnType<Exclude<RouteRecordRaw['beforeEnter'], RouteRecordRaw['beforeEnter'][] | undefined>>
}

describe('createAuth', () => {
  it('creates a transaction-backed login flow and hydrates the authenticated user', async () => {
    let isLoggedIn = false

    const provider = {
      client: {
        isLoggedIn: vi.fn(() => Promise.resolve(isLoggedIn)),
        getAccessToken: vi.fn(() => Promise.resolve('access-token')),
        getLoginUrl: vi.fn((_redirectUrl?: string, options?: {
          state?: string
        }) => Promise.resolve(`https://auth.example.com/login?state=${options?.state ?? ''}`)),
        getLogoutUrl: vi.fn(() => 'https://auth.example.com/logout'),
        loginWithCode: vi.fn(() => {
          isLoggedIn = true

          return Promise.resolve()
        }),
        logout: vi.fn(() => {
          isLoggedIn = false
        }),
        sanitizeRedirectUrl: vi.fn((redirectUrl: string | null, fallbackUrl: string = '/') => redirectUrl ?? fallbackUrl),
      },
      key: 'default',
      route: {
        name: 'auth-login',
        path: 'login',
      },
    }
    const auth = createAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(() => Promise.resolve({
        uuid: 'user-1',
        email: 'john.doe@example.com',
      })),
      providers: [
        provider,
      ],
      storagePrefix: 'auth-test',
    })

    const loginUrl = await auth.getLoginUrl('default', '/dashboard')
    const state = new URL(loginUrl).searchParams.get('state')

    expect(state).not.toBeNull()

    const redirectUrl = await auth.handleCallback('auth-code', state)

    expect(redirectUrl).toBe('/dashboard')
    expect(auth.currentProviderKey.value).toBe('default')
    expect(auth.getCurrentUser()).toEqual({
      uuid: 'user-1',
      email: 'john.doe@example.com',
    })
    expect(auth.currentUser.value).toEqual({
      uuid: 'user-1',
      email: 'john.doe@example.com',
    })
  })

  it('redirects unauthenticated users to the configured login route', async () => {
    const auth = createAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(),
      providers: [
        {
          client: {
            isLoggedIn: vi.fn(() => Promise.resolve(false)),
            getAccessToken: vi.fn(() => Promise.resolve('token')),
            getLoginUrl: vi.fn(() => Promise.resolve('https://auth.example.com/login')),
            getLogoutUrl: vi.fn(() => 'https://auth.example.com/logout'),
            loginWithCode: vi.fn(() => Promise.resolve()),
            logout: vi.fn(() => {}),
            sanitizeRedirectUrl: vi.fn((redirectUrl: string | null, fallbackUrl: string = '/') => redirectUrl ?? fallbackUrl),
          },
          key: 'default',
          route: {
            name: 'auth-login',
            path: 'login',
          },
        },
      ],
    })

    const redirect = await auth.requireAuth({
      fullPath: '/dashboard',
      path: '/dashboard',
    } as unknown as Parameters<typeof auth.requireAuth>[0], {
      path: '/',
    } as Parameters<typeof auth.requireAuth>[1])

    expect(redirect).toEqual({
      name: 'auth-login',
      query: {
        redirectUrl: '/dashboard',
      },
    })
  })

  it('does not clear the session for transient current-user network failures', async () => {
    const auth = createAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
      providers: [
        {
          client: {
            isLoggedIn: vi.fn(() => Promise.resolve(true)),
            getAccessToken: vi.fn(() => Promise.resolve('token')),
            getLoginUrl: vi.fn(() => Promise.resolve('https://auth.example.com/login')),
            getLogoutUrl: vi.fn(() => 'https://auth.example.com/logout'),
            loginWithCode: vi.fn(() => Promise.resolve()),
            logout: vi.fn(() => {}),
            sanitizeRedirectUrl: vi.fn((redirectUrl: string | null, fallbackUrl: string = '/') => redirectUrl ?? fallbackUrl),
          },
          key: 'default',
          route: {
            name: 'auth-login',
            path: 'login',
          },
        },
      ],
    })

    const redirect = await auth.requireAuth({
      fullPath: '/dashboard',
      path: '/dashboard',
    } as unknown as Parameters<typeof auth.requireAuth>[0], {
      path: '/',
    } as Parameters<typeof auth.requireAuth>[1])

    expect(redirect).toBeUndefined()
    expect(auth.currentProviderKey.value).toBe('default')
  })

  it('uses the default provider oidc prefix for controller storage when no storagePrefix is set', async () => {
    const auth = createAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(() => Promise.resolve({
        uuid: 'user-1',
      })),
      providers: [
        {
          key: 'default',
          oidc: {
            clientId: 'client-id',
            baseUrl: 'https://auth.example.com',
            loginRedirectUri: 'https://app.example.com/auth/callback',
            postLogoutRedirectUri: 'https://app.example.com/auth/logout',
            prefix: 'taxi-hendriks',
            scopes: [
              'openid',
            ],
          },
          route: {
            name: 'auth-login',
            path: 'login',
          },
        },
      ],
    })

    await auth.getLoginUrl('default', '/dashboard')

    expect(sessionStorage.getItem('taxi-hendriks:transactions')).not.toBeNull()
  })

  it('marks packaged login routes as guest-only', async () => {
    const auth = createAuth({
      defaultProviderKey: 'default',
      fetchCurrentUser: vi.fn(() => Promise.resolve({
        uuid: 'user-1',
      })),
      providers: [
        {
          client: {
            isLoggedIn: vi.fn(() => Promise.resolve(true)),
            getAccessToken: vi.fn(() => Promise.resolve('token')),
            getLoginUrl: vi.fn(() => Promise.resolve('https://auth.example.com/login')),
            getLogoutUrl: vi.fn(() => 'https://auth.example.com/logout'),
            loginWithCode: vi.fn(() => Promise.resolve()),
            logout: vi.fn(() => {}),
            sanitizeRedirectUrl: vi.fn((redirectUrl: string | null, fallbackUrl: string = '/') => redirectUrl ?? fallbackUrl),
          },
          key: 'default',
          route: {
            name: 'auth-login',
            path: 'login',
          },
        },
      ],
    })

    auth.currentUser.value = {
      uuid: 'user-1',
    }
    auth.hasAttemptedToFetchAuthUser.value = true

    const authRootRoute = auth.routes[0]
    const authChildren = getPackagedAuthChildren(authRootRoute)
    const loginRoute = getRouteByName(authChildren, 'auth-login')
    const beforeEnter = getGuestGuard(loginRoute)

    expect(beforeEnter).toBeTypeOf('function')

    const redirect = await invokeGuestGuard(beforeEnter)

    expect(redirect).toEqual({
      path: '/',
    })
  })
})
