# `@wisemen/nestjs-auth`

Shared NestJS authentication helpers for public-route metadata, reusable HTTP
basic auth, and bearer authentication with API keys or OIDC.

## What it provides

- `Public()` and `isPublicContext(...)` for public-route metadata
- `BasicAuthModule` for registering shared basic auth definitions
- `@BasicAuth(name)` for guarding controllers and handlers
- `createBasicAuthMiddleware(...)` and `createBasicAuthRequestHandler(...)` for
  adapter-level protection
- `BearerAuthModule` for bearer authentication with static or database-backed
  OIDC trusts and API keys
- `BearerAuthContext` and `BearerAuthService` for authenticated-request context
  and API-key/OIDC-trust lifecycle management

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

## Configure Bearer Authentication

Register `BearerAuthModule` once in the application that owns the TypeORM
entities, Redis client, and domain-event emitter. It accepts API keys as bearer
tokens and can authenticate OIDC tokens against either static or dynamic
trusts.

Pass the application's existing `DomainEventEmitter` when registering the
module. The auth package uses that emitter for its OIDC flows; it does not
register a separate event-emitter module.

On a first successful OIDC authentication, the module persists the identity and
emits `IdentityCreatedEvent` inside the same transaction. Subscribe to that
event in the consuming application to provision application-specific user data.

```ts
import { Module } from '@nestjs/common'
import { BearerAuthModule } from '@wisemen/nestjs-auth'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { RedisClient } from '@wisemen/nestjs-redis'

@Module({
  imports: [
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
  ]
})
export class AuthenticationModule {}
```

Use `forRootAsync(...)` when the main configuration or a static trust comes
from an application service such as `ConfigService`. Static trust identifiers
must be known when the module is registered, because each one gets a dedicated
Nest provider.

### Static Trusts

Each entry in `oidcTrusts` exposes an authenticator under its trust ID. It
routes API keys to the API-key authenticator and all other bearer tokens to
that trust's OIDC authenticator.

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

### Dynamic Trusts

The unqualified `Authenticator` resolves OIDC trusts stored as
`DynamicOidcTrust` entities from the token's issuer and audience. Use it when
the trusted issuers are managed at runtime rather than fixed in application
configuration. The resolver caches an in-memory verifier for each dynamic trust
for five minutes by default; set `dynamicOidcTrustCacheTtlInSeconds` to change
that period.

Use `BearerAuthMiddleware` (or `@InjectDynamicAuthMiddleware()`) to establish
the request context before accessing `BearerAuthContext`. Failed bearer
authentication is retained in that context, so `getPrincipalOrFail()` raises
the package's authentication error at the application boundary.

```ts
import { Injectable } from '@nestjs/common'
import { BearerAuthContext } from '@wisemen/nestjs-auth'

@Injectable()
export class CurrentActorService {
  constructor (private readonly authContext: BearerAuthContext) {}

  getCurrentActor () {
    return this.authContext.getPrincipalOrFail()
  }
}
```

## Manage API Keys And Dynamic OIDC Trusts

`BearerAuthService` is exported by `BearerAuthModule` for transaction-safe
create, read, and delete operations on `ApiKey`, plus create, read, update,
and delete operations on `DynamicOidcTrust`. Insert and update input types
deliberately omit generated columns, so consumers can pass only persisted
business fields.

Every successful write emits a domain event inside the database transaction:
`api-key.created`, `api-key.deleted`,
`dynamic-oidc-trust.created`, `dynamic-oidc-trust.updated`, or
`dynamic-oidc-trust.deleted`. Events only contain the affected record's ID.
Deleting an API key invalidates its authentication cache; changing a dynamic
trust clears only that trust's locally cached OIDC verifiers after commit.

Inject this service instead of writing those entities through repositories
directly. For API keys, generate and return the plaintext secret in the
application boundary; pass only its hash and safe trailing characters to
`createApiKey(...)`. The package does not persist or return a plaintext secret.

```ts
import { Injectable } from '@nestjs/common'
import { BearerAuthService } from '@wisemen/nestjs-auth'

@Injectable()
export class ApiKeyService {
  constructor (private readonly auth: BearerAuthService) {}

  async create (secretHash: string, secretLastChars: string) {
    return await this.auth.createApiKey({
      name: 'CI deployment',
      secretHash,
      secretLastChars,
      expiresAt: null
    })
  }
}
```

Dynamic trusts require `issuer`, `audiences`, `jwksEndpoint`, and resolved
claim names. For default claims, store `{ sub: 'sub', additional: [] }`.
`findApiKey(...)` and `findDynamicOidcTrust(...)` return `null` when no record
exists; the corresponding update and delete methods return `false`.

Subscribe to the exported event classes when application-specific work must
follow a lifecycle change: `ApiKeyCreatedEvent`, `ApiKeyDeletedEvent`,
`DynamicOidcTrustCreatedEvent`, `DynamicOidcTrustUpdatedEvent`, and
`DynamicOidcTrustDeletedEvent`. Their event content contains only the affected
API-key UUID or OIDC-trust ID.

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

## Register Role-Based Access Control

`RbacModule` supplies the common role HTTP endpoints, role-permission cache,
and lifecycle events for an application-owned TypeORM entity. Extend the
abstract `Role` with application-specific columns and register that entity.
The base class deliberately has no `@Entity()` decorator, so only the
application subclass creates a table.

```ts
import { Entity, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { ApiOAuth2 } from '@nestjs/swagger'
import { RbacModule, Role } from '@wisemen/nestjs-auth'

@Entity()
class WorkspaceRole extends Role<Permission> {
  @Column({ type: 'boolean', default: false })
  isDefault: boolean

  @Column({ type: 'boolean', default: false })
  isSystemAdmin: boolean
}

class WorkspaceRoleResponse {
  @ApiProperty()
  isDefault: boolean

  @ApiProperty()
  isSystemAdmin: boolean

  constructor (role: WorkspaceRole) {
    Object.assign(this, role)
  }
}

RbacModule.register({
  imports: [DefaultRedisModule],
  role: WorkspaceRole,
  permissions: Permission,
  permissionEnumName: 'Permission',
  roleAssignment: UserRole,
  isEditable: role => !role.isSystemAdmin,
  eventSubjectType: 'role',
  response: WorkspaceRoleResponse,
  controllers: {
    create: true,
    viewIndex: true,
    viewDetail: true,
    update: true,
    delete: true,
    updatePermissions: true,
    clearCache: true
  },
  decorators: {
    class: [ApiOAuth2([])],
    create: [Permissions(Permission.ROLE_CREATE)],
    read: [Permissions(Permission.ROLE_READ)],
    update: [Permissions(Permission.ROLE_UPDATE)],
    delete: [Permissions(Permission.ROLE_DELETE)],
    updatePermissions: [Permissions(Permission.ROLE_UPDATE)],
    clearCache: [Permissions(Permission.ROLE_CACHE_CLEAR)]
  }
})
```

All generated controllers are enabled by default. Set an individual
`controllers` entry to `false` to omit its route; decorators are only needed
for the controllers that remain enabled.

Each registration is isolated by the extended role entity. Its generated Nest
module, providers, controllers, cache namespace, and cache-event subscriber do
not collide with another role entity. `RoleCreatedEvent`, `RoleDeletedEvent`,
`RoleRenamedEvent`, and `RolePermissionsUpdatedEvent` use the stable
`role.*` event names and the configured `eventSubjectType`.

Inject that registration's cache with
`@InjectRolePermissionsCache(WorkspaceRole)`. The cache provider is exported
by the registered module and returns the union of the registered roles'
permissions.
