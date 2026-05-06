import pkceChallenge from 'pkce-challenge'

import type { AuthOidcConfig } from './auth.type'

const REFRESH_BUFFER_IN_MS = 30_000
const REDIRECT_VALIDATION_ORIGIN = 'https://wisemen-auth.local'

interface OAuthTokensResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

interface StoredTokens {
  accessToken: string
  expiresAt: number
  refreshToken: string | null
}

export class OidcClient {
  private readonly allowedPaths: string[]
  private readonly blockedPaths: string[]
  private readonly codeVerifierStorageKey: string
  private readonly tokensStorageKey: string

  constructor(
    private readonly config: AuthOidcConfig,
    private readonly providerConfig: {
      scopes: string[]
    },
  ) {
    const prefix = config.prefix?.trim() || 'wisemen-auth'

    this.allowedPaths = config.allowedPaths ?? []
    this.blockedPaths = config.blockedPaths ?? []
    this.codeVerifierStorageKey = `${prefix}:code-verifier`
    this.tokensStorageKey = `${prefix}:tokens`
  }

  async getAccessToken(): Promise<string> {
    const tokens = this.readTokens()

    if (tokens === null) {
      throw new Error('No authenticated session found')
    }

    if (Date.now() + REFRESH_BUFFER_IN_MS < tokens.expiresAt) {
      return tokens.accessToken
    }

    return await this.refresh(tokens)
  }

  async getLoginUrl(state: string): Promise<string> {
    const codes = await pkceChallenge()
    const searchParams = new URLSearchParams()

    this.getLocalStorage()?.setItem(this.codeVerifierStorageKey, codes.code_verifier)

    searchParams.set('client_id', this.config.clientId)
    searchParams.set('redirect_uri', this.config.loginRedirectUri)
    searchParams.set('response_type', 'code')
    searchParams.set('prompt', 'login')
    searchParams.set('scope', this.providerConfig.scopes.join(' '))
    searchParams.set('code_challenge', codes.code_challenge)
    searchParams.set('code_challenge_method', 'S256')
    searchParams.set('state', state)

    return `${this.config.baseUrl}/oauth/v2/authorize?${searchParams.toString()}`
  }

  getLogoutUrl(): string {
    const searchParams = new URLSearchParams()

    searchParams.set('client_id', this.config.clientId)
    searchParams.set('post_logout_redirect_uri', this.config.postLogoutRedirectUri)

    return `${this.config.baseUrl}/oidc/v1/end_session?${searchParams.toString()}`
  }

  async hasSession(): Promise<boolean> {
    const tokens = this.readTokens()

    if (tokens === null) {
      return false
    }

    try {
      await this.getAccessToken()

      return true
    }
    catch {
      this.clear()

      return false
    }
  }

  async loginWithCode(code: string): Promise<void> {
    const storage = this.getLocalStorage()
    const codeVerifier = storage?.getItem(this.codeVerifierStorageKey) ?? null

    if (codeVerifier === null) {
      throw new Error('Missing PKCE code verifier')
    }

    try {
      const response = await this.requestTokens({
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.config.loginRedirectUri,
      })

      this.writeTokens(response)
    }
    catch (error) {
      this.clear()

      throw error
    }
    finally {
      storage?.removeItem(this.codeVerifierStorageKey)
    }
  }

  sanitizeRedirectUrl(redirectUrl: string | null | undefined, fallbackUrl = '/'): string {
    const safeFallbackUrl = this.isAllowedRedirectUrl(fallbackUrl) ? fallbackUrl : '/'

    if (redirectUrl === null || redirectUrl === undefined) {
      return safeFallbackUrl
    }

    return this.isAllowedRedirectUrl(redirectUrl) ? redirectUrl : safeFallbackUrl
  }

  clear(): void {
    const storage = this.getLocalStorage()

    storage?.removeItem(this.codeVerifierStorageKey)
    storage?.removeItem(this.tokensStorageKey)
  }

  private getLocalStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage
  }

  private isAllowedRedirectUrl(redirectUrl: string): boolean {
    const normalizedRedirectUrl = this.normalizeRedirectUrl(redirectUrl)

    if (normalizedRedirectUrl === null) {
      return false
    }

    if (this.blockedPaths.some((path) => this.matchesPath(normalizedRedirectUrl.pathname, path))) {
      return false
    }

    if (this.allowedPaths.length === 0) {
      return true
    }

    return this.allowedPaths.some((path) => {
      if (path.includes('?') || path.includes('#')) {
        return normalizedRedirectUrl.path === path
      }

      return this.matchesPath(normalizedRedirectUrl.pathname, path)
    })
  }

  private matchesPath(pathname: string, candidate: string): boolean {
    if (candidate.endsWith('/*')) {
      return pathname.startsWith(candidate.slice(0, -1))
    }

    return pathname === candidate || pathname.startsWith(`${candidate}/`)
  }

  private normalizeRedirectUrl(redirectUrl: string): {
    path: string
    pathname: string
  } | null {
    if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
      return null
    }

    try {
      const parsedRedirectUrl = new URL(redirectUrl, REDIRECT_VALIDATION_ORIGIN)

      if (parsedRedirectUrl.origin !== REDIRECT_VALIDATION_ORIGIN) {
        return null
      }

      return {
        path: `${parsedRedirectUrl.pathname}${parsedRedirectUrl.search}${parsedRedirectUrl.hash}`,
        pathname: parsedRedirectUrl.pathname,
      }
    }
    catch {
      return null
    }
  }

  private readTokens(): StoredTokens | null {
    const serializedTokens = this.getLocalStorage()?.getItem(this.tokensStorageKey) ?? null

    if (serializedTokens === null) {
      return null
    }

    try {
      return JSON.parse(serializedTokens) as StoredTokens
    }
    catch {
      this.clear()

      return null
    }
  }

  private async refresh(tokens: StoredTokens): Promise<string> {
    if (tokens.refreshToken === null) {
      this.clear()

      throw new Error('No refresh token available')
    }

    const response = await this.requestTokens({
      grant_type: 'refresh_token',
      refresh_token: tokens.refreshToken,
    })

    this.writeTokens(response, tokens.refreshToken)

    return response.access_token
  }

  private async requestTokens(body: Record<string, string>): Promise<OAuthTokensResponse> {
    const searchParams = new URLSearchParams(body)

    searchParams.set('client_id', this.config.clientId)

    const response = await fetch(`${this.config.baseUrl}/oauth/v2/token`, {
      body: searchParams,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange auth tokens (${response.status})`)
    }

    return await response.json() as OAuthTokensResponse
  }

  private writeTokens(tokens: OAuthTokensResponse, previousRefreshToken?: string | null): void {
    this.getLocalStorage()?.setItem(this.tokensStorageKey, JSON.stringify({
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      refreshToken: tokens.refresh_token ?? previousRefreshToken ?? null,
    } satisfies StoredTokens))
  }
}
