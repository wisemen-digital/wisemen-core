---
title: Installation
layout: doc
---

# Installation

`@wisemen/payload-core-auth` helps you connect a Payload user collection to an external auth provider.

Right now the package is centered around Zitadel and gives you:

- a provider-backed Payload auth strategy
- a helper that builds the `auth` config for your user collection
- a user `afterChange` hook for syncing users into Zitadel
- client login and callback components
- Next.js middleware helpers for token refresh and forwarding bearer tokens to Payload

## Install

```ts
import {
  createPayloadAuthPlugin,
  createZitadelAuthProvider,
} from '@wisemen/payload-core-auth'
```

## Basic setup

```ts
import { buildConfig } from 'payload'
import {
  createPayloadAuthPlugin,
  createZitadelAuthProvider,
} from '@wisemen/payload-core-auth'

const payloadAuth = createPayloadAuthPlugin({
  provider: createZitadelAuthProvider({
    authBaseUrl: process.env.AUTH_BASE_URL!,
    authClientId: process.env.AUTH_CLIENT_ID!,
    authIssuer: process.env.AUTH_ISSUER!,
    authJwksEndpoint: process.env.AUTH_JWKS_ENDPOINT!,
    authOrganizationId: process.env.AUTH_ORGANIZATION_ID!,
    authServiceUser: process.env.AUTH_SERVICE_USER!,
    cmsBaseUrl: process.env.CMS_BASE_URL!,
  }),
  isUserAllowed: (user) => user.role === 'admin',
  tenantCollectionSlug: 'tenants',
  userCollectionSlug: 'users',
})

export default buildConfig({
  collections: [
    {
      slug: 'users',
      auth: payloadAuth.createCollectionAuth(),
      hooks: {
        afterChange: [payloadAuth.userHook],
      },
      fields: [],
    },
  ],
})
```

## What it adds to your collection

This package does not auto-register a collection. Instead, you wire the returned helpers into your own user collection.

`payloadAuth.createCollectionAuth()` creates the Payload `auth` block for that collection and sets:

- `disableLocalStrategy: true`
- `strategies: [providerStrategy]`
- `tokenExpiration`
- `maxLoginAttempts`
- `lockTime`
- `verify`

That means the collection becomes externally authenticated instead of using Payload's local email/password flow.

## What the hook adds

Attach `payloadAuth.userHook` to your user collection `afterChange` hooks.

On user creation it:

- skips non-`create` operations
- optionally skips users through `shouldSkipUserSync`
- checks whether the matching Zitadel user already exists
- creates the Zitadel user when needed

## First-user bootstrapping

By default, the strategy can create the first tenant and first user when no users exist yet. Pass a `createFirstUser` configuration to customize that flow, or pass `createFirstUser: false` to disable it explicitly.

This is useful for fresh environments where the first admin authenticates through Zitadel before a Payload user record exists.

## Login decisions and multiple strategies

`isUserAllowed` remains a simple boolean check. Use `canLogin` when a valid
Zitadel session should be rejected with an application-visible reason and HTTP
status:

```ts
const payloadAuth = createPayloadAuthPlugin({
  // ...
  canLogin: (customer) => customer.status === 'approved'
    ? { allowed: true }
    : { allowed: false, reason: 'Your account is awaiting approval.', status: 403 },
  createFirstUser: false,
  strategyName: 'customer-zitadel',
})
```

The default strategy name is `zitadel`. Set `strategyName` when more than one
Zitadel-backed user collection is registered in the same Payload instance.

## Client and server helpers

Client exports from `@wisemen/payload-core-auth/client`:

- `LoginButton`
- `CallbackView`
- `loginWithCode`
- `logout`

Server exports from `@wisemen/payload-core-auth/server`:

- `refreshToken`
- `withPayloadTokenAuth`

`withPayloadTokenAuth(...)` reads the stored tokens, refreshes them when they are close to expiry, and injects the `Authorization` header for downstream Payload auth.

## Notes

- This package depends on `@wisemen/payload-core-utils` for `getPayload()`.
- Current provider support is Zitadel through `createZitadelAuthProvider(...)`.
