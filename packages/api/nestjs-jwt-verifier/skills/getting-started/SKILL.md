---
name: getting-started
description: Use when registering one or more shared JWT verifiers in a NestJS application and resolving verifier config from ConfigService or another application boundary.
---

# @wisemen/nestjs-jwt-verifier - Getting Started

Use `JwtVerifierModule.forRoot(...)` or `JwtVerifierModule.forRootAsync(...)`
to register a shared JWT verifier that:

- validates issuer and audience claims
- resolves signing keys from a remote JWKS endpoint
- can be registered multiple times in the same Nest container
- exposes a plain `JwtVerifier` class for manual construction and tests

## Register The Module

Resolve config at the application boundary and pass it into the module.

```ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  JwtVerifierModule,
  type JwtVerifierModuleAsyncOptions,
  type JwtVerifierOptions
} from '@wisemen/nestjs-jwt-verifier'

@Module({
  imports: [
    JwtVerifierModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtVerifierOptions => ({
        issuer: configService.getOrThrow('AUTH_ISSUER'),
        audiences: [configService.getOrThrow('AUTH_AUDIENCE')],
        jwksEndpoint: configService.getOrThrow('AUTH_JWKS_ENDPOINT')
      })
    })
  ]
})
export class AuthModule {}
```

Use `forRoot(...)` when the values are already known statically.

## Register Multiple Verifiers

Use `name` when the application needs more than one verifier:

```ts
JwtVerifierModule.forRootAsync({
  name: 'backoffice',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    issuer: configService.getOrThrow('BACKOFFICE_AUTH_ISSUER'),
    audiences: [configService.getOrThrow('BACKOFFICE_AUTH_AUDIENCE')],
    jwksEndpoint: configService.getOrThrow('BACKOFFICE_AUTH_JWKS_ENDPOINT')
  })
})
```

Inject a named verifier with `@InjectJwtVerifier(...)`:

```ts
import { InjectJwtVerifier, JwtVerifier } from '@wisemen/nestjs-jwt-verifier'

export class TokenService {
  constructor (
    @InjectJwtVerifier('backoffice')
    private verifier: JwtVerifier
  ) {}
}
```

When `name` is omitted, inject `JwtVerifier` directly or use
`@InjectJwtVerifier()`.

## Manual Construction

For tests or non-Nest usage, instantiate the class directly:

```ts
import { createRemoteJWKSet } from 'jose'
import { JwtVerifier } from '@wisemen/nestjs-jwt-verifier'

const verifier = new JwtVerifier(
  {
    issuer: 'https://issuer.example',
    audiences: ['my-api'],
    jwksEndpoint: 'https://issuer.example/.well-known/jwks.json'
  },
  createRemoteJWKSet(new URL('https://issuer.example/.well-known/jwks.json'))
)
```
