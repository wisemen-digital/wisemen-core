import pkceChallenge from 'pkce-challenge'

import { ApiClient } from './apiClient'
import type {
  OAuth2VueClientOptions,
  OidcUser,
} from './oidc.type'
import { RedirectValidator } from './redirectValidator'
import { LocalStorageTokensStrategy } from './tokens-strategy/localStorage.tokensStrategy'
import type { TokensStrategy } from './tokens-strategy/tokensStrategy.type'

export class OidcClient {
  private client: ApiClient | null = null
  private readonly offline: boolean
  private redirectValidator: RedirectValidator
  private tokensStrategy: TokensStrategy

  constructor(private options: OAuth2VueClientOptions) {
    this.offline = options.offline ?? false

    this.tokensStrategy = this.options.tokensStrategy ?? new LocalStorageTokensStrategy(this.options.prefix)

    this.redirectValidator = new RedirectValidator(
      {
        allowedPaths: this.options.allowedPaths ?? [],
        blockedPaths: this.options.blockedPaths ?? [],
      },
    )

    this.client = new ApiClient(
      {
        clientId: this.options.clientId,
        baseUrl: this.options.baseUrl,
        redirectUri: this.options.loginRedirectUri,
        scopes: this.options.scopes,
        tokensStrategy: this.tokensStrategy,
      },
    )
  }

  private getTokensStrategy(): TokensStrategy {
    return this.tokensStrategy
  }

  /*
  * Get the access token
  * This will return the access token from the identity provider
  * If the access token is expired, it will try to refresh it
  * If it fails, it will throw an error
  */
  public async getAccessToken(): Promise<string> {
    if (this.client === null) {
      throw new Error('Client is not initialized')
    }

    return await this.client.getAccessToken()
  }

  /*
  * Get the client
  * This will return the client that is used to make requests to the identity provider
  */
  public getClient(): ApiClient {
    if (this.client === null) {
      throw new Error('Client is not initialized')
    }

    return this.client
  }

  public async getIdentityProviderLoginUrl(idpId: string): Promise<string> {
    const searchParams = new URLSearchParams()

    const codes = await pkceChallenge()

    const scopes = this.options.scopes

    scopes.push(`urn:zitadel:iam:org:idp:id:${idpId}`)

    this.getTokensStrategy().setCodeVerifier(codes.code_verifier)

    searchParams.append('client_id', this.options.clientId)
    searchParams.append('redirect_uri', this.options.loginRedirectUri)
    searchParams.append('response_type', 'code')
    searchParams.append('scope', scopes.join(' '))
    searchParams.append('code_challenge', codes.code_challenge)
    searchParams.append('code_challenge_method', 'S256')

    return `${this.options.baseUrl}/oauth/v2/authorize?${searchParams.toString()}`
  }

  public async getLoginUrl(redirectUrl?: string): Promise<string> {
    const searchParams = new URLSearchParams()

    const codes = await pkceChallenge()

    const scopes = this.options.scopes

    this.getTokensStrategy().setCodeVerifier(codes.code_verifier)

    searchParams.append('client_id', this.options.clientId)
    searchParams.append('redirect_uri', this.options.loginRedirectUri)
    searchParams.append('response_type', 'code')
    searchParams.append('prompt', 'login')

    if (redirectUrl !== undefined) {
      const safeRedirectUrl = this.sanitizeRedirectUrl(redirectUrl)

      searchParams.append('state', safeRedirectUrl)
    }

    searchParams.append('scope', scopes.join(' '))
    searchParams.append('code_challenge', codes.code_challenge)
    searchParams.append('code_challenge_method', 'S256')

    return `${this.options.baseUrl}/oauth/v2/authorize?${searchParams.toString()}`
  }

  /*
  * Get the logout URL
  * Use this to redirect the user to the logout page of the identity provider
  */
  public getLogoutUrl(): string {
    const searchParams = new URLSearchParams()

    searchParams.append('client_id', this.options.clientId)
    searchParams.append('post_logout_redirect_uri', this.options.postLogoutRedirectUri)

    return `${this.options.baseUrl}/oidc/v1/end_session?${searchParams.toString()}`
  }

  /*
  * Get the user info
  * This will return the user info from the identity provider
  */
  async getUserInfo(): Promise<OidcUser> {
    try {
      return await this.getClient().getUserInfo()
    }
    catch (error) {
      this.logout()

      throw error
    }
  }

  /*
  * Check if the user is logged in
  * If the access token is expired, it will try to refresh it and add it to the fetch instance headers
  * If it fails, it will log the user out
  */
  public async isLoggedIn(): Promise<boolean> {
    if (this.options.offline === true) {
      return true
    }

    if (this.client === null) {
      return false
    }

    if (this.getClient().getTokens() === null) {
      return false
    }

    try {
      await this.client.getAccessToken()

      return true
    }
    catch (error) {
      console.error('Failed to get access token, logging out', error)

      this.logout()

      return false
    }
  }

  /*
  * Login the user offline by setting mock tokens
  */
  public loginOffline(): void {
    if (this.client === null) {
      throw new Error('Client is not initialized')
    }

    this.client.setMockTokens()
  }

  /*
  * Login the user with the code from the identity provider
  * It will get the access token and add it to the fetch instance headers
  */
  public async loginWithCode(code: string): Promise<void> {
    if (this.options.offline === true) {
      this.loginOffline()

      return
    }

    try {
      await this.getClient().loginWithCode(code)
    }
    catch (error) {
      this.logout()

      throw error
    }
  }

  /*
  * Logout the user by clearing the tokens and removing the authorization header
  */
  public logout(): void {
    this.client?.clearTokens()
    this.client = null
  }

  public sanitizeRedirectUrl(redirectUrl: string, fallbackUrl?: string): string {
    return this.redirectValidator.sanitizeRedirectUrl(redirectUrl, fallbackUrl)
  }

  public setConfig(options: Partial<OAuth2VueClientOptions>): void {
    const nextOptions = {
      ...this.options,
      ...options,
    }

    if (options.tokensStrategy !== undefined) {
      this.tokensStrategy = options.tokensStrategy
    }
    else if (
      this.options.tokensStrategy === undefined
      && options.prefix !== undefined
      && options.prefix !== this.options.prefix
    ) {
      this.tokensStrategy = new LocalStorageTokensStrategy(nextOptions.prefix)
    }

    this.client = new ApiClient(
      {
        clientId: nextOptions.clientId,
        baseUrl: nextOptions.baseUrl,
        redirectUri: nextOptions.loginRedirectUri,
        scopes: nextOptions.scopes,
        tokensStrategy: this.tokensStrategy,
      },
    )
    this.options = nextOptions
  }
}
