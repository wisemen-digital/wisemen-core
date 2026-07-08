import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { refreshToken } from '#server/refreshToken.ts'
import {
  getAuthData,
  getRemoveAuthCookieHeaders,
} from '#shared/authData.ts'
import type { AuthProviderType } from '#shared/payloadAuth.types.ts'

interface AuthEnv {
  authClientId: string
  authOrganizationId: string
  authBaseUrl: string
  provider: AuthProviderType
}

interface MiddlewareState {
  request: NextRequest
  response: NextResponse
}

interface WithPayloadTokenAuthParams {
  auth: AuthEnv
  loginPath?: string
  tokenRefreshBufferMs?: number
}

export async function withPayloadTokenAuth(
  middlewareState: MiddlewareState,
  {
    auth,
    loginPath = '/login',
    tokenRefreshBufferMs = 30_000,
  }: WithPayloadTokenAuthParams,
) {
  const {
    request, response,
  } = middlewareState

  if (request.nextUrl.pathname === loginPath) {
    return middlewareState
  }

  const authData = await getAuthData({
    req: request,
    res: response,
  })

  if (authData == null) {
    return middlewareState
  }

  let accessToken = authData.accessToken

  if (authData.expiresAt <= Date.now() + tokenRefreshBufferMs) {
    try {
      const refreshedAuth = await refreshToken({
        clientId: auth.authClientId,
        organizationId: auth.authOrganizationId,
        authBaseUrl: auth.authBaseUrl,
        provider: auth.provider,
        req: request,
        res: response,
      })

      accessToken = refreshedAuth.accessToken
    }
    catch {
      const unauthenticatedResponse = NextResponse.next({
        headers: response.headers,
      })

      for (const [
        key,
        value,
      ] of getRemoveAuthCookieHeaders().entries()) {
        unauthenticatedResponse.headers.append(key, value)
      }

      return {
        request,
        response: unauthenticatedResponse,
      }
    }
  }

  const requestHeaders = new Headers(request.headers)

  requestHeaders.set('Authorization', `Bearer ${accessToken}`)

  return {
    request,
    response: NextResponse.next({
      headers: response.headers,
      request: {
        headers: requestHeaders,
      },
    }),
  }
}
