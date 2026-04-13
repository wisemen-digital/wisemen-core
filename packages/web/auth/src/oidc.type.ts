import type { TokensStrategy } from './tokens-strategy/tokensStrategy.type'

export interface OidcUser {
  updated_at: number
  name: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  locale: string | null
  preferred_username: string
  sub: string
}

export interface OAuth2VueClientOptions {
  /*
  * The client ID
  */
  clientId: string
  /*
    * The paths that are allowed to be accessed for redirects
    * If not set, all paths are allowed
   */
  allowedPaths?: string[]
  /*
  * The base URL of the OAuth2 server
  */
  baseUrl: string
  /*
    * The paths that are blocked for redirects
    * If not set, no paths are blocked
     */
  blockedPaths?: string[]
  /*
  * The URL to redirect to after login
  */
  loginRedirectUri: string
  /*
   * If offline is true, the client wil bypass everything and work without a real login
   */
  offline?: boolean
  /*
  * The URL to redirect to after logout
  */
  postLogoutRedirectUri: string
  /*
  * Prefix for localStorage keys used by the default LocalStorageTokensStrategy
  * Useful to avoid collisions between multiple localhost apps
  */
  prefix?: string
  /*
  * The scopes to request from the OAuth2 server
  */
  scopes: string[]
  /*
  * The tokens strategy to use
  * Default: localStorageStrategy
  */
  tokensStrategy?: TokensStrategy
}
