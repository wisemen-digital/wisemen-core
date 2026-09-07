# `@wisemen/nestjs-auth`

Shared NestJS auth helpers for public-route metadata and reusable HTTP basic
auth.

## What it provides

- `Public()` and `isPublicContext(...)` for public-route metadata
- `BasicAuthModule` for registering shared basic auth definitions
- `@BasicAuth(name)` for guarding controllers and handlers
- `createBasicAuthMiddleware(...)` and `createBasicAuthRequestHandler(...)` for
  adapter-level protection

## Mark Public Routes

Use `Public()` on a controller or handler to mark it as public. Pass `false` to
override public metadata inherited from a controller class.

```ts
import { Controller, Get } from '@nestjs/common'
import { Public } from '@wisemen/nestjs-auth'

@Controller('status')
export class StatusController {
  @Get()
  @Public()
  getStatus(): string {
    return 'ok'
  }

  @Get('internal')
  @Public(false)
  getInternalStatus(): string {
    return 'restricted'
  }
}
```

Use `isPublicContext(...)` inside guards or interceptors so the application
does not need to depend on the metadata key directly.

## Register And Use Basic Auth

Import `BasicAuthModule.forRoot()` once to initialize the shared registry, then
register feature-local definitions close to the routes that use them.

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [BasicAuthModule.forRoot()]
})
export class AppModule {}
```

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [BasicAuthModule.forFeature({
    docs: {
      username: 'docs',
      password: 'secret'
    }
  })]
})
export class DocsAuthModule {}
```

Protect handlers with `@BasicAuth(name)` once the matching definition is
registered.

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

Use `forFeatureAsync(...)` when credentials come from configuration or secrets.
Definition names must stay unique unless they resolve to the same credentials.

## Protect Adapter-Level Routes

Use `createBasicAuthMiddleware(...)` in Nest middleware or
`createBasicAuthRequestHandler(...)` when attaching handlers directly to the
HTTP adapter.

## Inject A Static-Trust Authenticator

Each OIDC trust configured on `AuthModule` exposes an authenticator under its
trust ID. It routes API keys to the API-key authenticator and all other bearer
tokens to that trust's OIDC authenticator.

Pass the application's existing `DomainEventEmitter` when registering the
module. The auth package uses that emitter for its OIDC flows; it does not
register a separate event-emitter module.

On a first successful authentication, the module persists the identity and
emits `IdentityCreatedEvent` inside the same transaction. Subscribe to that
event in the consuming application to provision application-specific user data.

## Authenticate Against Database Trusts

`AuthModule` also exports the default `Authenticator`, which resolves the OIDC
trust from the token's issuer and audience. Trusts are stored as
`DynamicOidcTrust` entities. The resolver caches each in-memory verifier for
five minutes by default; configure `dynamicOidcTrustCacheTtlInSeconds` to
change that period.

```ts
import { AuthModule } from '@wisemen/nestjs-auth'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { RedisClient } from '@wisemen/nestjs-redis'

AuthModule.forRoot({
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

```ts
import { Injectable } from '@nestjs/common'
import { Authenticator, InjectAuthenticator } from '@wisemen/nestjs-auth'

@Injectable()
export class BackofficeMiddleware {
  constructor (
    @InjectAuthenticator('backoffice')
    private readonly authenticator: Authenticator
  ) { }
}
```

## Retain Additional OIDC Claims

The subject claim defaults to `sub` and is the required external identity key.
Additional claims are opt-in and are stored in the identity's `claims`
JSONB column. No additional claims are retained by default. Every configured
additional claim is stored; a claim absent from a token has the value `null`.

```ts
oidcTrusts: {
  backoffice: {
    issuer: 'https://auth.example.test',
    audiences: ['backoffice-api'],
    jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json',
    claims: {
      sub: 'user_id',
      additional: ['email', 'name']
    }
  }
}
```
