import type { AuthResponse } from '#shared/authData.ts'
import type { AuthProviderType } from '#shared/payloadAuth.types.ts'

interface GetLoginUrlParams {
  clientId: string
  organizationId: string
  authBaseUrl: string
  cmsBaseUrl: string
  codeChallenge: string
  searchParams: URLSearchParams
}

interface ExchangeAuthorizationCodeParams {
  clientId: string
  organizationId: string
  authBaseUrl: string
  cmsBaseUrl: string
  code: string
  codeVerifier: string
}

interface RefreshProviderTokenParams {
  clientId: string
  organizationId: string
  authBaseUrl: string
  refreshToken: string
}

interface AuthClientStrategy {
  exchangeAuthorizationCode: (params: ExchangeAuthorizationCodeParams) => Promise<AuthResponse>
  getLoginUrl: (params: GetLoginUrlParams) => string
  refreshToken: (params: RefreshProviderTokenParams) => Promise<AuthResponse>
}

function getZitadelScopes(organizationId: string) {
  return [
    'openid',
    'profile',
    'email',
    'offline_access',
    `urn:zitadel:iam:org:id:${organizationId}`,
  ]
}

async function parseAuthResponse(response: Response, errorMessage: string): Promise<AuthResponse> {
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${await response.text()}`)
  }

  return response.json() as Promise<AuthResponse>
}

const zitadelClientStrategy: AuthClientStrategy = {
  exchangeAuthorizationCode: async ({
    clientId,
    organizationId,
    authBaseUrl,
    cmsBaseUrl,
    code,
    codeVerifier,
  }) => parseAuthResponse(await fetch(`${authBaseUrl}/oauth/v2/token`, {
    body: new URLSearchParams({
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: `${cmsBaseUrl}/auth/callback`,
      scope: getZitadelScopes(organizationId).join(' '),
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  }), 'Failed to exchange authorization code'),
  getLoginUrl: ({
    clientId,
    organizationId,
    authBaseUrl,
    cmsBaseUrl,
    codeChallenge,
    searchParams,
  }) => {
    searchParams.append('client_id', clientId)
    searchParams.append('redirect_uri', `${cmsBaseUrl}/auth/callback`)
    searchParams.append('response_type', 'code')
    searchParams.append('prompt', 'login')
    searchParams.append('scope', getZitadelScopes(organizationId).join(' '))
    searchParams.append('code_challenge', codeChallenge)
    searchParams.append('code_challenge_method', 'S256')

    return `${authBaseUrl}/oauth/v2/authorize?${searchParams.toString()}`
  },
  refreshToken: async ({
    clientId,
    authBaseUrl,
    refreshToken,
  }) => parseAuthResponse(await fetch(`${authBaseUrl}/oauth/v2/token`, {
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  }), 'Failed to refresh token'),
}

export function getAuthClientStrategy(provider: AuthProviderType): AuthClientStrategy {
  switch (provider) {
    case 'zitadel':
      return zitadelClientStrategy
    default:
      throw new Error(`Unsupported auth provider: ${provider}`)
  }
}
