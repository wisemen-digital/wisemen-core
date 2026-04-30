import type { RouteRecordRaw } from 'vue-router'

import type {
  AuthController,
  AuthRouteMeta,
  CreateAuthOptions,
} from './auth.type'
import {
  DefaultAuthCallbackView,
  DefaultAuthLoginView,
  DefaultAuthLogoutView,
} from './auth.views'

export function createAuthRoutes<TUser>(
  auth: AuthController<TUser>,
  options: CreateAuthOptions<TUser>,
): RouteRecordRaw[] {
  const defaultProvider = auth.providers.find((provider) => provider.key === options.defaultProviderKey)

  if (defaultProvider === undefined) {
    throw new Error(`Unknown default auth provider "${options.defaultProviderKey}"`)
  }

  const basePath = options.routes?.basePath ?? '/auth'
  const callbackPath = options.routes?.callbackPath ?? 'callback'
  const callbackName = options.routes?.callbackName ?? 'auth-callback'
  const logoutPath = options.routes?.logoutPath ?? 'logout'
  const logoutName = options.routes?.logoutName ?? 'auth-logout'

  async function requireGuest(
    ...args: Parameters<AuthController<TUser>['requireGuest']>
  ): ReturnType<AuthController<TUser>['requireGuest']> {
    return await auth.requireGuest(...args)
  }

  return [
    {
      path: basePath,
      redirect: {
        name: defaultProvider.route.name,
      },
      children: [
        ...auth.providers.map((provider) => ({
          name: provider.route.name,
          beforeEnter: requireGuest,
          path: provider.route.path,
          component: options.views?.login ?? DefaultAuthLoginView,
          meta: {
            authAutoStart: provider.route.autoStart ?? false,
            authProviderKey: provider.key,
          } satisfies AuthRouteMeta,
        })),
        {
          name: callbackName,
          path: callbackPath,
          component: options.views?.callback ?? DefaultAuthCallbackView,
        },
        {
          name: logoutName,
          path: logoutPath,
          component: options.views?.logout ?? DefaultAuthLogoutView,
        },
      ],
    },
  ] satisfies RouteRecordRaw[]
}
