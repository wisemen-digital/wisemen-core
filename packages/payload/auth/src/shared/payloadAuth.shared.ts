import type { AuthStrategyResult } from 'payload'

import { getRemoveAuthCookieHeaders } from '#shared/authData.ts'

export const USER_NOT_AUTHENTICATED: AuthStrategyResult = {
  user: null,
}

export function getUnauthenticatedResult(clearAuth: boolean): AuthStrategyResult {
  if (!clearAuth) {
    return USER_NOT_AUTHENTICATED
  }

  return {
    responseHeaders: getRemoveAuthCookieHeaders(),
    user: null,
  }
}
