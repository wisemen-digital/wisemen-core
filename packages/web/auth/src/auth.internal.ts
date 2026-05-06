import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type {
  AuthMessages,
  CreateAuthOptions,
} from './auth.type'
import type { OidcClient } from './oidc.internal'

export interface ResolvedAuthProvider {
  autoStart: boolean
  key: string
  label: string
  loginPath: string
  loginRoutePath: string
  client: OidcClient
}

export interface AuthRouteMeta {
  authAutoStart?: boolean
  authProviderKey?: string
  public?: boolean
}

export interface InternalAuthController {
  completeLogin: (code: string | null, state: string | null) => Promise<string>
  getAuthenticatedRoute: () => RouteLocationRaw
  getLoginRouteLocation: (redirectUrl?: string) => RouteLocationRaw
  logout: () => Promise<void>
  messages: Required<AuthMessages>
  providers: ResolvedAuthProvider[]
  startLogin: (providerKey?: string, redirectUrl?: string) => Promise<void>
}

export const INTERNAL_AUTH_CONTROLLER_KEY = Symbol('wisemen-auth') as InjectionKey<InternalAuthController>

export function useInternalAuth<TUser>(): InternalAuthController {
  const auth = inject(INTERNAL_AUTH_CONTROLLER_KEY, null)

  if (auth === null) {
    throw new Error('Auth plugin is not installed')
  }

  return auth as InternalAuthController
}

export function getDefaultMessages(messages?: AuthMessages): Required<AuthMessages> {
  return {
    callbackDescription: 'Completing your sign in.',
    callbackTitle: 'Signing you in',
    loginDescription: 'Continue with your organization account.',
    loginTitle: 'Sign in',
    logoutDescription: 'Ending your current session.',
    logoutTitle: 'Signing you out',
    signInLabel: 'Sign in',
    ...messages,
  }
}

export function getAuthRouteConfig(options: Pick<CreateAuthOptions<unknown>, 'defaultRedirectPath' | 'routes'>): {
  authBasePath: string
  callbackPath: string
  callbackRoutePath: string
  defaultRedirectPath: string
  logoutPath: string
  logoutRoutePath: string
} {
  const authBasePath = normalizePath(options.routes?.basePath ?? '/auth')
  const callbackPath = normalizeChildPath(options.routes?.callbackPath ?? 'callback')
  const logoutPath = normalizeChildPath(options.routes?.logoutPath ?? 'logout')

  return {
    authBasePath,
    callbackPath,
    callbackRoutePath: joinPaths(authBasePath, callbackPath),
    defaultRedirectPath: options.defaultRedirectPath ?? '/',
    logoutPath,
    logoutRoutePath: joinPaths(authBasePath, logoutPath),
  }
}

export function joinPaths(basePath: string, childPath: string): string {
  if (childPath.startsWith('/')) {
    return normalizePath(childPath)
  }

  if (childPath === '') {
    return normalizePath(basePath)
  }

  return normalizePath(`${normalizePath(basePath)}/${childPath}`)
}

export function normalizePath(path: string): string {
  const trimmedPath = path.trim()

  if (trimmedPath === '' || trimmedPath === '/') {
    return '/'
  }

  return `/${trimmedPath.replace(/^\/+|\/+$/g, '')}`
}

function normalizeChildPath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}
