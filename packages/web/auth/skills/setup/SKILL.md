---
name: auth-setup
description: >
  Minimal setup for @wisemen/vue-core-auth: create an OIDC client, redirect to
  login, handle the callback, attach access tokens, and logout.
type: core
library: vue-core-auth
---

# @wisemen/vue-core-auth - Setup

## Import

```ts
import { OidcClient } from '@wisemen/vue-core-auth'
```

Older projects may still use `ZitadelClient`; new setup should use
`OidcClient`.

## Create The Client

```ts
// src/libs/oAuth.lib.ts
import { OidcClient } from '@wisemen/vue-core-auth'

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
} from '@/constants/environment.constant.ts'

export const oAuthClient = new OidcClient({
  clientId: AUTH_CLIENT_ID,
  baseUrl: AUTH_BASE_URL,
  loginRedirectUri: `${window.location.origin}/auth/callback`,
  postLogoutRedirectUri: `${window.location.origin}/auth/logout`,
  scopes: ['openid', 'profile', 'email'],
  prefix: 'my-app',
})
```

Use `prefix` to avoid localStorage token collisions between apps.

## Login

```ts
const loginUrl = await oAuthClient.getLoginUrl('/dashboard')

window.location.replace(loginUrl)
```

The optional argument is stored as `state` and should be used as the post-login
redirect path.

## Callback

```ts
const searchParams = new URLSearchParams(window.location.search)
const code = searchParams.get('code')
const state = searchParams.get('state')

if (code === null) {
  throw new Error('Missing authorization code')
}

await oAuthClient.loginWithCode(code)

const redirectUrl = state === null
  ? '/'
  : oAuthClient.sanitizeRedirectUrl(state, '/')

window.location.replace(redirectUrl)
```

## Access Tokens

```ts
const token = await oAuthClient.getAccessToken()
```

`getAccessToken()` refreshes the token when needed.

For API clients, attach the bearer token only when logged in:

```ts
client.interceptors.request.use(async (request) => {
  if (!await oAuthClient.isLoggedIn()) {
    return request
  }

  const token = await oAuthClient.getAccessToken()

  request.headers.set('Authorization', `Bearer ${token}`)

  return request
})
```

## Route Protection

```ts
const isLoggedIn = await oAuthClient.isLoggedIn()

if (!isLoggedIn) {
  const loginUrl = await oAuthClient.getLoginUrl(window.location.pathname)

  window.location.replace(loginUrl)
}
```

## Logout

```ts
oAuthClient.logout()

window.location.replace(oAuthClient.getLogoutUrl())
```

## Source Files

- Client: `src/oidcClient.ts`
- Types: `src/oidc.type.ts`
