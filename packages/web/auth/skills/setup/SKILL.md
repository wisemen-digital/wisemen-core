---
name: auth-setup
description: >
  Initialize OidcClient with OAuth2/OIDC configuration, implement the login flow
  with PKCE, handle the callback, access tokens, get user info, and logout.
  Covers offline mode for testing and custom token storage strategies.
type: core
library: vue-core-auth
---

# @wisemen/vue-core-auth — Setup & Login Flow

## Import

```ts
import { OidcClient, LocalStorageTokensStrategy } from '@wisemen/vue-core-auth'
import type { OAuth2VueClientOptions, OidcUser, OAuth2Tokens } from '@wisemen/vue-core-auth'
```

## Quick Start

### 1. Create the client

```ts
// auth.ts
import { OidcClient } from '@wisemen/vue-core-auth'

export const oAuthClient = new OidcClient({
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL,
  loginRedirectUri: `${window.location.origin}/auth/callback`,
  postLogoutRedirectUri: `${window.location.origin}/auth/logout`,
  scopes: ['openid', 'profile', 'email'],
  prefix: 'my-app',
})
```

### 2. Redirect to login

```ts
async function login() {
  const loginUrl = await oAuthClient.getLoginUrl('/dashboard')
  window.location.href = loginUrl
}
```

### 3. Handle the callback

```ts
// AuthCallbackPage.vue or router guard
const searchParams = new URLSearchParams(window.location.search)
const code = searchParams.get('code')
const state = searchParams.get('state')

await oAuthClient.loginWithCode(code)
const redirectPath = oAuthClient.sanitizeRedirectUrl(state)
router.push(redirectPath)
```

### 4. Use in API calls

```ts
const token = await oAuthClient.getAccessToken()
// Token is auto-refreshed if expired
```

### 5. Get user info

```ts
const user = await oAuthClient.getUserInfo()
// user: { sub, name, email, email_verified, given_name, family_name, preferred_username, locale }
```

### 6. Logout

```ts
oAuthClient.logout()
window.location.href = oAuthClient.getLogoutUrl()
```

## Examples

### Router guard for protected routes

```ts
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await oAuthClient.isLoggedIn()
    if (!isAuthenticated) {
      const loginUrl = await oAuthClient.getLoginUrl(to.fullPath)
      window.location.href = loginUrl
      return false
    }
  }
})
```

### Identity provider login (e.g. Google via Zitadel)

```ts
async function loginWithGoogle() {
  const idpLoginUrl = await oAuthClient.getIdentityProviderLoginUrl('google-idp-id')
  window.location.href = idpLoginUrl
}
```

### Offline mode for testing

```ts
const oAuthClient = new OidcClient({
  clientId: 'test',
  baseUrl: 'http://localhost',
  loginRedirectUri: 'http://localhost/callback',
  postLogoutRedirectUri: 'http://localhost/logout',
  scopes: ['openid'],
  offline: true,
})

oAuthClient.loginOffline()
await oAuthClient.isLoggedIn() // true
```

### Custom token storage strategy

```ts
import type { TokensStrategy } from '@wisemen/vue-core-auth'

class SessionStorageTokensStrategy implements TokensStrategy {
  getTokens() { return JSON.parse(sessionStorage.getItem('tokens') ?? 'null') }
  setTokens(tokens) { sessionStorage.setItem('tokens', JSON.stringify(tokens)) }
  removeTokens() { sessionStorage.removeItem('tokens') }
  getCodeVerifier() { return sessionStorage.getItem('code_verifier') }
  setCodeVerifier(v) { sessionStorage.setItem('code_verifier', v) }
  removeCodeVerifier() { sessionStorage.removeItem('code_verifier') }
}

const oAuthClient = new OidcClient({
  // ...options
  tokensStrategy: new SessionStorageTokensStrategy(),
})
```

## Source Files

For full API details, read the source files.

- Client: `src/oidcClient.ts`
- Types: `src/oidc.type.ts`
- Token Storage: `src/tokens-strategy/tokensStrategy.type.ts`, `src/tokens-strategy/localStorage.tokensStrategy.ts`
