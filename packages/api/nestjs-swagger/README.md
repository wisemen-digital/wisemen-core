# `@wisemen/nestjs-swagger`

Shared NestJS Swagger wiring for Wisemen APIs, including optional HTTP basic
auth, OpenID Connect support, static Swagger UI assets, and JSON doc export.

## What it provides

- `SwaggerModule.forRoot()` to register the OAuth2 redirect controller
- `SwaggerModule.writeSwaggerJsonDocs(...)` to generate static Swagger docs on disk
- optional docs protection through `@wisemen/nestjs-auth`
- optional OpenID Connect discovery for OAuth2 authorization code flows

## Usage

Register the module once so the OAuth2 redirect endpoint is available.

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'
import { SwaggerModule } from '@wisemen/nestjs-swagger'

@Module({
  imports: [
    BasicAuthModule.forRoot(),
    BasicAuthModule.forFeature({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    }),
    SwaggerModule.forRoot({
      controller: {
        route: '/api/docs',
        basicAuth: 'docs',
        outputDir: './var/swagger'
      }
    })
  ]
})
export class AppModule {}
```

Write the docs during bootstrap.

```ts
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@wisemen/nestjs-swagger'
import { AppModule } from './app.module.js'

const app = await NestFactory.create(AppModule)

await SwaggerModule.writeSwaggerJsonDocs(app, {
  servers: ['http://localhost:3000'],
  oidcUrl: 'https://auth.example.com/.well-known/openid-configuration',
  additionalScopes: {
    'api:write': 'Write access'
  }
})
```

Configure the docs routes on the module itself.

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'
import { SwaggerModule } from '@wisemen/nestjs-swagger'

@Module({
  imports: [
    BasicAuthModule.forRoot(),
    BasicAuthModule.forFeature({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    }),
    SwaggerModule.forRoot({
      controller: {
        route: '/api/docs',
        basicAuth: 'docs'
      }
    })
  ]
})
export class AppModule {}
```

With that setup, the package serves the main Swagger UI route together with
versioned docs endpoints such as `/api/docs/latest`, `/api/docs/all`, and the
matching JSON routes from the generated files in `./var/swagger`.

## OpenID Connect Notes

Set `oidcUrl` to load the authorization and token endpoints from discovery. Use
`redirectServer` when Swagger UI should build its OAuth2 redirect URL from a
specific public origin.

`SwaggerModule.forRoot(...)` must be registered on the server that exposes the
`/api/oauth2-redirect` route.
