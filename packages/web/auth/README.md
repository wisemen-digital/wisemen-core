# `@wisemen/vue-core-auth`

Browser auth utilities for Vue applications using OIDC providers.

## Installation

```bash
pnpm add @wisemen/vue-core-auth
```

## `createAuth`

`createAuth` packages the common SPA auth flow:

- provider configuration
- packaged login / callback / logout routes
- route guards for authenticated and guest-only screens
- current-user hydration
- token access for downstream HTTP clients

```ts
import { createAuth } from '@wisemen/vue-core-auth'

const auth = createAuth({
  defaultAuthenticatedRoute: {
    name: 'dashboard',
  },
  defaultProviderKey: 'default',
  fetchCurrentUser: async ({ accessToken }) => {
    const response = await fetch('/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to load current user')
    }

    return await response.json()
  },
  providers: [
    {
      key: 'default',
      label: 'Sign in',
      oidc: {
        baseUrl: 'https://auth.example.com',
        blockedPaths: ['/auth/*'],
        clientId: 'web-client',
        loginRedirectUri: `${window.location.origin}/auth/callback`,
        postLogoutRedirectUri: `${window.location.origin}/auth/logout`,
        prefix: 'my-app',
        scopes: ['openid', 'profile', 'email'],
      },
      route: {
        name: 'auth-login',
        path: 'login',
      },
    },
  ],
})
```

## Vue Integration

```ts
import { createApp } from 'vue'

import App from './App.vue'
import { auth } from './auth'
import { router } from './router'

const app = createApp(App)

app.use(auth, {
  router,
})
app.use(router)
```

Use the packaged routes in your router:

```ts
const routes = [
  {
    path: '/',
    meta: {
      middleware: [auth.requireAuth],
    },
    children: [
      {
        path: '',
        component: () => import('./DashboardLayout.vue'),
      },
    ],
  },
  ...auth.routes,
]
```

## Custom Packaged Views

The package ships with minimal default login / callback / logout screens. Override them when the app needs custom UX:

```ts
const auth = createAuth({
  // ...
  views: {
    login: CustomLoginView,
    callback: CustomCallbackView,
    logout: CustomLogoutView,
  },
})
```

## `OidcClient` / `ZitadelClient`

If an app only needs low-level token and redirect helpers, you can still use `OidcClient` directly. `ZitadelClient` remains available as a compatibility alias.
