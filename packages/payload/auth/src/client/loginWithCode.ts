import { getAuthClientStrategy } from '#providers/providerStrategy.ts'
import type { AuthClientConfig } from '#shared/authData.ts'
import {
  removePkceCookies,
  setAuthCookie,
} from '#shared/authData.ts'

interface LoginWithCodeParams extends AuthClientConfig {
  code: string
  codeVerifier: string
}

export async function loginWithCode({
  clientId,
  organizationId,
  authBaseUrl,
  cmsBaseUrl,
  code,
  codeVerifier,
  provider,
}: LoginWithCodeParams): Promise<{ success: boolean }> {
  if (!codeVerifier) {
    throw new Error('Code verifier not found')
  }

  const strategy = getAuthClientStrategy(provider)
  const response = await strategy.exchangeAuthorizationCode({
    clientId,
    organizationId,
    authBaseUrl,
    cmsBaseUrl,
    code,
    codeVerifier,
  })

  setAuthCookie(response)
  removePkceCookies()

  return {
    success: true,
  }
}
