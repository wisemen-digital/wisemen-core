import {
  deleteCookie,
  getCookie,
  setCookie,
} from 'cookies-next'
import type {
  NextRequest,
  NextResponse,
} from 'next/server'
import { z } from 'zod'

import type { AuthProviderType } from '#shared/payloadAuth.types.ts'

export const AUTH_COOKIE_NAME = 'tokens'
export const CODE_CHALLENGE_COOKIE_NAME = 'code_challenge'
export const CODE_VERIFIER_COOKIE_NAME = 'code_verifier'
const EXPIRED_AUTH_COOKIE = `${AUTH_COOKIE_NAME}=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

export const tokensSchema = z.object({
  expires_at: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
})

export interface AuthResponse {
  access_token: string
  expires_in: number
  id_token?: string
  refresh_token: string
  token_type: string
}

export interface AuthData {
  expiresAt: number
  accessToken: string
  refreshToken: string
}

export interface AuthClientConfig {
  clientId: string
  organizationId: string
  authBaseUrl: string
  cmsBaseUrl: string
  provider: AuthProviderType
}
export interface CookieContext {
  req?: NextRequest
  res?: NextResponse
}

export function setAuthCookie(authResponse: AuthResponse, context?: CookieContext) {
  const expiresAt = Date.now() + authResponse.expires_in * 1000
  const tokens = {
    expires_at: expiresAt,
    access_token: authResponse.access_token,
    refresh_token: authResponse.refresh_token,
    token_type: authResponse.token_type,
  }

  setCookie(AUTH_COOKIE_NAME, JSON.stringify(tokens), {
    ...context,
    maxAge: authResponse.expires_in,
    sameSite: 'lax',
    path: '/',
  })

  return {
    expiresAt,
    accessToken: authResponse.access_token,
    refreshToken: authResponse.refresh_token,
  } satisfies AuthData
}

export async function getAuthData({
  req, res,
}: {
  req: NextRequest
  res: NextResponse
}): Promise<AuthData | null> {
  const tokensCookie = await getCookie(AUTH_COOKIE_NAME, {
    req,
    res,
  })

  if (typeof tokensCookie !== 'string') {
    return null
  }

  const parsedTokens = tokensSchema.safeParse(JSON.parse(tokensCookie))

  if (!parsedTokens.success) {
    return null
  }

  return {
    expiresAt: Number(parsedTokens.data.expires_at),
    accessToken: parsedTokens.data.access_token,
    refreshToken: parsedTokens.data.refresh_token,
  }
}

export function removeAuthCookie(context?: CookieContext) {
  deleteCookie(AUTH_COOKIE_NAME, {
    ...context,
    path: '/',
  })
}

export function removePkceCookies() {
  deleteCookie(CODE_CHALLENGE_COOKIE_NAME, {
    path: '/',
  })
  deleteCookie(CODE_VERIFIER_COOKIE_NAME, {
    path: '/',
  })
}

export function getRemoveAuthCookieHeaders() {
  const headers = new Headers()

  headers.append('Set-Cookie', EXPIRED_AUTH_COOKIE)

  return headers
}
