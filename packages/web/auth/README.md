# Wisemen vue-core OAuth Client

This package provides a simple way to authenticate with an OAuth2 server.

## Installation

```bash
pnpm add @wisemen/vue-core-oauth-client
```

## Usage

### OAuth2VueClient
Create a new file `auth.lib.ts` and add the following code:

```typescript
import { OAuth2VueClient } from '@wisemen/vue-core-auth'
import axios from 'axios'

import {
  API_AUTH_URL,
  API_CLIENT_ID,
  API_CLIENT_SECRET,
} from '@/constants/environment.constant.ts'

export const oAuthClient = new OAuth2VueClient({
  clientId: API_CLIENT_ID,
  axios,
  clientSecret: API_CLIENT_SECRET,
  tokenEndpoint: `${API_AUTH_URL}/token`,
})
```

### ZitadelClient

Create a new file `auth.lib.ts` and add the following code:

```typescript
import { ZitadelClient, useAxiosFetchStrategy, localStorageTokensStrategy } from '@wisemen/vue-core-auth'
import axios from 'axios'

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_ORGANIZATION_ID,
  CURRENT_ENVIRONMENT,
} from '@/constants/environment.constant.ts'

export const oAuthClient = new ZitadelClient({
  clientId: AUTH_CLIENT_ID,
  organizationId: AUTH_ORGANIZATION_ID,
  fetchStrategy: new AxiosFetchStrategy(axios),
  prefix: 'my-app', // Optional, prefixes localStorage keys used by the default strategy
  tokensStrategy: new LocalStorageTokensStrategy(), // Optional, defaults to localStorage
  baseUrl: AUTH_BASE_URL,
  loginRedirectUri: `${window.location.origin}/auth/callback`,
  offline: CURRENT_ENVIRONMENT === 'e2e',
  postLogoutRedirectUri: `${window.location.origin}/auth/logout`,
})
```
