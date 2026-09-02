# @wisemen/nestjs-jwt-verifier

Shared JWT verification helpers for NestJS applications. The package provides a
plain `JwtVerifier` class plus a `JwtVerifierModule` that can register one or
more named verifier instances in Nest DI.

## Register A Verifier

Use `JwtVerifierModule.forRootAsync(...)` when the verifier settings come from
`ConfigService` or another application-specific source.

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
    } satisfies JwtVerifierModuleAsyncOptions)
  ]
})
export class AuthModule {}
```

Use `forRoot(...)` when the values are already available statically.

## Inject Multiple Verifiers

Pass `name` during registration when the application needs multiple JWT
verifiers in the same Nest container.

```ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  InjectJwtVerifier,
  JwtVerifier,
  JwtVerifierModule
} from '@wisemen/nestjs-jwt-verifier'

@Module({
  imports: [
    JwtVerifierModule.forRootAsync({
      name: 'backoffice',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        issuer: configService.getOrThrow('BACKOFFICE_AUTH_ISSUER'),
        audiences: [configService.getOrThrow('BACKOFFICE_AUTH_AUDIENCE')],
        jwksEndpoint: configService.getOrThrow('BACKOFFICE_AUTH_JWKS_ENDPOINT')
      })
    }),
    JwtVerifierModule.forRootAsync({
      name: 'portal',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        issuer: configService.getOrThrow('PORTAL_AUTH_ISSUER'),
        audiences: [configService.getOrThrow('PORTAL_AUTH_AUDIENCE')],
        jwksEndpoint: configService.getOrThrow('PORTAL_AUTH_JWKS_ENDPOINT')
      })
    })
  ]
})
export class IdentityModule {}

export class TokenService {
  constructor (
    @InjectJwtVerifier('backoffice')
    private readonly backofficeVerifier: JwtVerifier,
    @InjectJwtVerifier('portal')
    private readonly portalVerifier: JwtVerifier
  ) {}
}
```

For an unnamed default verifier, inject `JwtVerifier` directly or use
`@InjectJwtVerifier()`.

## Manual Construction

The `JwtVerifier` class is exported directly for tests or non-Nest usage:

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
