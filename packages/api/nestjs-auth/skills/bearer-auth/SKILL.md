---
name: bearer-auth
description: Use when configuring bearer authentication with @wisemen/nestjs-auth - registering BearerAuthModule, static or dynamic OIDC trusts, API keys, the bearer middleware, BearerAuthContext, or the Identity/ApiKey/DynamicOidcTrust tables.
---

# @wisemen/nestjs-auth - Bearer Authentication

Authenticate bearer tokens as API keys or OIDC identities.

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
- Apply bearer middleware before any request-scoped code reads
  `BearerAuthContext`; see "Apply Bearer Middleware" below.

`BearerAuthContext.getPrincipal()` returns `null` when no authenticated
principal is available. Use `getPrincipalOrFail()` only after bearer middleware
has run; it raises the retained authorization error for invalid credentials.
The principal is either an identity (`type: 'identity'`) or API key
(`type: 'api-key'`).

## Apply Bearer Middleware

Both middleware providers resolve to a bound function, not a class. Inject it
and pass it to `consumer.apply(...)`:

```ts
constructor (
  @InjectDynamicAuthMiddleware() private readonly authMiddleware: Function
) {}

configure (consumer: MiddlewareConsumer): void {
  consumer.apply(this.authMiddleware).forRoutes('api')
}
```

Use `@InjectAuthMiddleware(trustId)` for a static trust. Apply the middleware
before anything reads `BearerAuthContext`.

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

## Persist The Authentication Entities

`Identity`, `ApiKey`, and `DynamicOidcTrust` are concrete entities in the
`wisemen_authentication` schema (exported as `SCHEMA_NAME`). Register them on
the application `DataSource`:

```ts
import { ApiKey, DynamicOidcTrust, Identity } from '@wisemen/nestjs-auth'

new DataSource({
  entities: [ApiKey, DynamicOidcTrust, Identity, /* application entities */]
})
```

This package ships no migrations; generate and run them in the application.

**`typeorm migration:generate` never emits the `CREATE SCHEMA` statement** —
it diffs entity metadata into table-level DDL only, so a freshly generated
migration creates `wisemen_authentication.identity` etc. without first
creating the schema. Left as generated, it fails on a clean database with:

```
QueryFailedError: schema "wisemen_authentication" does not exist
```

After generating, always add the schema manually: `CREATE SCHEMA IF NOT
EXISTS "wisemen_authentication"` as the *first* statement in `up()`, and
`DROP SCHEMA IF EXISTS "wisemen_authentication"` as the *last* statement in
`down()`, after the tables it contains have been dropped.

```ts
export class AddAuthenticationSchema1700000000000 implements MigrationInterface {
  async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "wisemen_authentication"`)
    // ... generated CREATE TABLE statements
  }

  async down (queryRunner: QueryRunner): Promise<void> {
    // ... generated DROP TABLE statements
    await queryRunner.query(`DROP SCHEMA IF EXISTS "wisemen_authentication"`)
  }
}
```

Generate API-key secrets with the exported `ApiKeySecret`; it produces the
prefixed format the authenticator recognises and the hash it matches. Store
`secret.hash` and `secret.lastChars`, and return `secret.value` to the caller
once.
