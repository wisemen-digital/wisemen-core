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
  isAllowedPrivateAccess: ({ user }) => user != null && user.role === 'admin',
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

## Collection access

Configure `isAllowedPrivateAccess` once when creating the auth plugin. It is
the default policy for managing protected data and for CMS access to reusable
collection policies. Keep this rule narrow: an admin-only rule is a good
starting point.

```ts
const payloadAuth = createPayloadAuthPlugin({
  // ...
  isAllowedPrivateAccess: ({ user }) => user != null && user.role === 'admin',
})
```

Use the configured policies directly in collection definitions:

```ts
import { AccessControl } from '@wisemen/payload-core-auth'

export const publicPageCollection = {
  slug: 'pages',
  access: AccessControl.publicCollection,
}

export const internalNoteCollection = {
  slug: 'internal-notes',
  access: AccessControl.privateCollection,
}

export const contactSubmissionCollection = {
  slug: 'contact-submissions',
  access: AccessControl.formCollection,
}
```

| Policy | Public create | Public read | CMS and data management |
| --- | --- | --- | --- |
| `publicCollection` | No | Yes | `isAllowedPrivateAccess` |
| `privateCollection` | No | No | `isAllowedPrivateAccess` |
| `formCollection` | Yes | No | `isAllowedPrivateAccess` |

`formCollection` is deliberately create-only for anonymous visitors. It never
allows public reads, updates, deletes, version reads, or unlocks, so form
submissions cannot be exposed by accidentally choosing a public policy.

### Custom roles and scoped rules

The Payload plugin binds each policy to the collection's configured `slug`.
Every rule receives that typed collection slug along with the user. Use
`customCollection` when a collection has a role-specific policy. Every
operation is explicit; an omitted operation is denied. Rules may return a
boolean or a Payload `Where` clause to scope access to matching documents.

```ts
import type { AccessControlContext } from '@wisemen/payload-core-auth'
import { AccessControl } from '@wisemen/payload-core-auth'

const canManageContent = ({ user }: AccessControlContext<User, string>) =>
  user?.role === 'admin' || user?.role === 'editor'

const canReadFormSubmissions = ({ user }: AccessControlContext<User, string>) =>
  user?.role === 'admin' || user?.role === 'submissions-viewer'

export const articleCollection = {
  slug: 'articles',
  access: AccessControl.customCollection({
    admin: canManageContent,
    create: canManageContent,
    delete: canManageContent,
    read: () => true,
    readVersions: canManageContent,
    unlock: canManageContent,
    update: canManageContent,
  }),
}

export const contactSubmissionCollection = {
  slug: 'contact-submissions',
  access: AccessControl.customCollection({
    admin: canReadFormSubmissions,
    create: () => true,
    delete: canReadFormSubmissions,
    read: canReadFormSubmissions,
    readVersions: canReadFormSubmissions,
    update: canReadFormSubmissions,
  }),
}
```

## Payload Nuxt template

In the Payload Nuxt template, configure the shared rule in
`apps/cms/src/plugins/auth.plugin.ts`. The template's user roles are `admin`,
`editor`, and `submissions-viewer`; start with `admin` for private access and
use `customCollection` where editors or submission viewers need more access.

```ts
import { isAdmin } from '@repo/utils'

export const payloadAuth = createPayloadAuthPlugin<User>({
  // provider, user collection, tenant collection, and other auth options
  isAllowedPrivateAccess: ({ user }) => user != null && isAdmin(user),
  isUserAllowed: (user) => isAdmin(user)
    || user.role === 'editor'
    || user.role === 'submissions-viewer',
})
```

Replace the template's bespoke helpers in
`apps/cms/src/modules/auth/utils/collectionAccess.util.ts` incrementally:

- import `AccessControl` from `@wisemen/payload-core-auth` in collection files;
- use `AccessControl.publicCollection` for
  admin-managed public data;
- use `AccessControl.privateCollection` for
  admin-only data;
- use `AccessControl.formCollection` for public forms that only
  administrators should manage;
- use `AccessControl.customCollection(...)` for content editors and
  submission viewers, keeping their permitted operations visible beside the
  collection.

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

By default, on user creation it:

- skips non-`create` operations
- optionally skips users through `shouldSkipUserSync`, which receives the full
  Payload `afterChange` hook arguments, including `doc` and `previousDoc`
- checks whether the matching Zitadel user already exists
- creates the Zitadel user when needed

To also create a missing Zitadel user after a Payload update, set
`operationsToCreate`. The hook uses the saved user document, so all user fields
are available on update:

```ts
const payloadAuth = createPayloadAuthPlugin({
  // ...
  operationsToCreate: ['create', 'update'],
})
```

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
