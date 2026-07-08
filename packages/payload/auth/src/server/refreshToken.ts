import type {
  NextRequest,
  NextResponse,
} from 'next/server'

import { getAuthClientStrategy } from '#providers/providerStrategy.ts'
import {
  getAuthData,
  setAuthCookie,
} from '#shared/authData.ts'
import type { AuthProviderType } from '#shared/payloadAuth.types.ts'

interface RefreshTokenParams {
  clientId: string
  organizationId: string
  authBaseUrl: string
  provider: AuthProviderType
  req: NextRequest
  res: NextResponse
}

export async function refreshToken({
  clientId,
  organizationId,
  authBaseUrl,
  provider,
  req,
  res,
}: RefreshTokenParams) {
  const authData = await getAuthData({
    req,
    res,
  })

  if (authData == null) {
    throw new Error('Auth data not found')
  }

  const strategy = getAuthClientStrategy(provider)
  const response = await strategy.refreshToken({
    clientId,
    organizationId,
    authBaseUrl,
    refreshToken: authData.refreshToken,
  })

  return setAuthCookie(response, {
    req,
    res,
  })
}
