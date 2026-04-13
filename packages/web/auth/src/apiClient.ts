/* eslint-disable no-console */

import type { OidcUser } from './oidc.type'
import type { TokensStrategy } from './tokens-strategy/tokensStrategy.type'

export interface OAuth2Tokens {
  expires_at: number
  access_token: string
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
}

interface ApiClientOptions {
  clientId: string
  baseUrl: string
  redirectUri: string
  scopes?: string[]
  tokensStrategy: TokensStrategy
}

interface Token {
  exp: number
}

const HYPHEN_REGEX = /-/g
const UNDERSCORE_REGEX = /_/g
const TRAILING_SLASH_REGEX = /\/$/

function decodeToken(token: string): Token {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(HYPHEN_REGEX, '+').replace(UNDERSCORE_REGEX, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

export class ApiClient {
  private _promise: Promise<void> | null = null

  constructor(private readonly options: ApiClientOptions) {}

  /*
  * @returns base url without trailing slash
  */
  private getBaseUrl(): string {
    return this.options.baseUrl.replace(TRAILING_SLASH_REGEX, '')
  }

  private async getNewAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
    const response = await fetch(`${this.getBaseUrl()}/oauth/v2/token`, {
      body: new URLSearchParams({
        client_id: this.options.clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        scope: this.options.scopes?.join(' ') ?? '',
      }),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      method: 'POST',
    })

    return await response.json() as OAuth2Tokens
  }

  private getTokensStrategy(): TokensStrategy {
    return this.options.tokensStrategy
  }

  private async refreshToken(): Promise<void> {
    if (this._promise != null) {
      return this._promise
    }

    this._promise = new Promise((resolve, reject) => {
      this.getNewAccessToken(this.getRefreshToken())
        .then((tokens) => {
          this.setTokens(tokens)
          resolve()
        })
        .catch(() => {
          console.log('Failed to refresh access token, trying again...')

          setTimeout(() => {
            this.getNewAccessToken(this.getRefreshToken())
              .then((tokens) => {
                this.setTokens(tokens)
                resolve()
              })
              .catch(() => {
                reject(new Error('Failed to refresh access token'))
              })
          }, 1000)
        })
        .finally(() => {
          this._promise = null
        })
    })

    return await this._promise
  }

  public clearTokens(): void {
    this.getTokensStrategy().removeTokens()
  }

  public async getAccessToken(): Promise<string> {
    if (this.isAccessTokenExpired()) {
      await this.refreshToken()
    }

    const tokens = this.getTokens()

    if (tokens === null) {
      throw new Error('No tokens found')
    }

    return tokens.access_token
  }

  public getRefreshToken(): string {
    const tokens = this.getTokens()

    if (tokens === null) {
      throw new Error('No tokens found')
    }

    return tokens.refresh_token
  }

  public getTokens(): OAuth2Tokens | null {
    return this.getTokensStrategy().getTokens()
  }

  async getUserInfo(): Promise<OidcUser> {
    const accessToken = await this.getAccessToken()

    const response = await fetch(`${this.getBaseUrl()}/oidc/v1/userinfo`, {
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
    })

    return await response.json() as OidcUser
  }

  public isAccessTokenExpired(): boolean {
    const tokens = this.getTokens()

    if (tokens === null) {
      return true
    }

    return Date.now() >= tokens.expires_at
  }

  public async loginWithCode(code: string): Promise<void> {
    const codeVerifier = this.getTokensStrategy().getCodeVerifier()

    if (codeVerifier === null) {
      throw new Error('Code verifier is not set')
    }

    const response = await fetch(`${this.getBaseUrl()}/oauth/v2/token`, {
      body: new URLSearchParams({
        client_id: this.options.clientId,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.options.redirectUri,
      }),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      method: 'POST',
    })

    const tokens = await response.json() as OAuth2Tokens

    this.getTokensStrategy().removeCodeVerifier()
    this.setTokens(tokens)
  }

  public setMockTokens(): void {
    const mockTokens = {
      expires_at: 0,
      access_token: '',
      id_token: '',
      refresh_token: '',
      scope: '',
      token_type: '',
    }

    this.getTokensStrategy().setTokens(mockTokens)
  }

  public setTokens(tokens: OAuth2Tokens): void {
    const expirationSinceUnixEpoch = decodeToken(tokens.access_token).exp

    const tokensWithExpiration = {
      expires_at: new Date(expirationSinceUnixEpoch * 1000).getTime(),
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
    }

    this.getTokensStrategy().setTokens(tokensWithExpiration)
  }
}
