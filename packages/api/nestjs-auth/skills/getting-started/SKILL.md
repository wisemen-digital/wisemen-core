---
name: getting-started
description: Use when configuring public routes, HTTP basic auth, bearer authentication, API keys, or OIDC trusts with @wisemen/nestjs-auth.
---

# @wisemen/nestjs-auth - Getting Started

Use this package for three separate concerns:

- mark routes as public with `Public()`
- protect routes with shared HTTP basic auth definitions
- authenticate bearer tokens as API keys or OIDC identities

## Mark Public Routes

Apply `Public()` at the class or method level. `Public(false)` explicitly
overrides a public controller annotation on a specific handler.

```ts
import { Controller, Get } from '@nestjs/common'
import { Public } from '@wisemen/nestjs-auth'

@Public()
@Controller('status')
export class StatusController {
  @Get('internal')
  @Public(false)
  getInternalStatus(): string {
    return 'restricted'
  }
}
```

Use `isPublicContext(...)` inside guards instead of reading metadata keys
directly.

## Register Basic Auth Definitions

Import `BasicAuthModule.forRoot()` once in the application and
`BasicAuthModule.forFeature(...)` or `forFeatureAsync(...)` in feature-local
modules that own the credentials.

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [
    BasicAuthModule.forRoot(),
    BasicAuthModule.forFeature({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    })
  ]
})
export class DocsAuthModule {}
```

## Protect Controllers And Handlers

Use `@BasicAuth(name)` when a Nest controller or handler should require one of
the registered definitions.

```ts
import { Controller, Get } from '@nestjs/common'
import { BasicAuth } from '@wisemen/nestjs-auth'

@Controller('docs')
export class DocsController {
  @Get()
  @BasicAuth('docs')
  getDocs(): string {
    return 'private docs'
  }
}
```

## Protect Adapter Routes

Use `createBasicAuthRequestHandler(...)` when the route is attached directly to
the underlying HTTP adapter instead of a Nest controller.

## Configure Bearer Authentication

Register `BearerAuthModule.forRoot(...)` once in the application that owns the
TypeORM connection, Redis client, and `DomainEventEmitter`. Supply the
application's existing event emitter; do not add a separate emitter module for
this package.

```ts
BearerAuthModule.forRoot({
  redisClient,
  domainEventEmitter,
  oidcTrusts: {
    backoffice: {
      issuer: 'https://auth.example.test',
      audiences: ['backoffice-api'],
      jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json'
    }
  }
})
```

Use `forRootAsync(...)` when configuration is resolved from an application
service. Static trust IDs are module-registration keys and must be known while
Nest builds the provider graph.

### Choose The Trust Model

- Use `oidcTrusts` and `@InjectAuthenticator(trustId)` for a statically known
  issuer. The authenticator accepts API keys and that trust's OIDC tokens.
- Use the unqualified `Authenticator` or `@InjectDynamicAuthenticator()` when
  trusts are managed in the database. The trust is selected from the token's
  issuer and audience.
- Use `BearerAuthMiddleware` or `@InjectDynamicAuthMiddleware()` before reading
  `BearerAuthContext` in request-scoped application code.

`BearerAuthContext.getPrincipal()` returns `null` when no authenticated
principal is available. Use `getPrincipalOrFail()` only after bearer middleware
has run; it raises the retained authorization error for invalid credentials.
The principal is either an identity (`type: 'identity'`) or API key
(`type: 'api-key'`).

## Manage API Keys And Dynamic Trusts

Use the exported `BearerAuthService` for API-key and dynamic-OIDC-trust
lifecycle operations. Do not bypass it with direct repository writes: the
service emits lifecycle events transactionally and invalidates the appropriate
authentication or verifier cache after a mutation.

- `createApiKey`, `findApiKey`, and `deleteApiKey`
- `createDynamicOidcTrust`, `findDynamicOidcTrust`, `updateDynamicOidcTrust`,
  and `deleteDynamicOidcTrust`

Generate plaintext API-key secrets at the application boundary. Pass only the
secret hash and safe trailing characters to `createApiKey(...)`; this package
does not persist plaintext secrets.

Dynamic trust records require `issuer`, `audiences`, `jwksEndpoint`, and
resolved claims. Use `{ sub: 'sub', additional: [] }` when the defaults are
appropriate. Configure `claims.additional` only for token claims the
application must retain; omitted token claims are stored as `null`.

Subscribe to the exported `ApiKeyCreatedEvent`, `ApiKeyDeletedEvent`,
`DynamicOidcTrustCreatedEvent`, `DynamicOidcTrustUpdatedEvent`, and
`DynamicOidcTrustDeletedEvent` for application-specific lifecycle work. Each
event carries only the affected entity ID.
