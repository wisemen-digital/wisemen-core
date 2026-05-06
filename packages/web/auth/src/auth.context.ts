import type { InjectionKey } from 'vue'
import { inject } from 'vue'

import type { AuthController } from './auth.type'

export const AUTH_CONTROLLER_KEY = Symbol('wisemen-auth-controller') as InjectionKey<AuthController<unknown>>

export function useAuth<TUser>(): AuthController<TUser> {
  const auth = inject(AUTH_CONTROLLER_KEY, null)

  if (auth === null) {
    throw new Error('Auth plugin is not installed')
  }

  return auth as AuthController<TUser>
}
