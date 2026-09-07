# `@wisemen/nestjs-swagger`

Shared NestJS Swagger wiring for Wisemen APIs, including optional HTTP basic
auth and OpenID Connect support.

## What it provides

- `SwaggerModule.forRoot()` to register the OAuth2 redirect controller
- `SwaggerModule.attachSwaggerEndpoints(...)` to attach Swagger UI and JSON docs
- `SwaggerModule.createDocument(...)` to create an OpenAPI document without attaching routes
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
    SwaggerModule.forRoot()
  ]
})
export class AppModule {}
```

Attach the docs during bootstrap.

```ts
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@wisemen/nestjs-swagger'
import { AppModule } from './app.module.js'

const app = await NestFactory.create(AppModule)

await SwaggerModule.attachSwaggerEndpoints(app, {
  route: '/api/docs',
  servers: ['http://localhost:3000'],
  basicAuth: 'docs',
  oidcUrl: 'https://auth.example.com/.well-known/openid-configuration',
  additionalScopes: {
    'api:write': 'Write access'
  }
})
```

With that setup, the package registers the main Swagger UI route together with
versioned docs endpoints such as `/api/docs/latest` and `/api/docs/all`.

## Generate an OpenAPI document

Use `createDocument` for build-time tasks such as generating an API client.
It does not attach routes or fetch OpenID Connect metadata, which keeps builds
deterministic. Pass already-resolved metadata explicitly when it is required.

```ts
const document = SwaggerModule.createDocument(app, {
  servers: ['https://api.example.com']
}, {
  version: '1.0'
})
```

## OpenID Connect Notes

Set `oidcUrl` to load the authorization and token endpoints from discovery. Use
`redirectServer` when Swagger UI should build its OAuth2 redirect URL from a
specific public origin.

`SwaggerModule.forRoot(...)` must be registered on the server that exposes the
`/api/oauth2-redirect` route.
