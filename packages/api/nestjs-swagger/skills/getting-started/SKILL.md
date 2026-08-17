---
name: getting-started
description: Use when attaching Swagger UI and OpenAPI endpoints to a NestJS app with optional basic auth and OpenID Connect configuration through @wisemen/nestjs-swagger.
---

# @wisemen/nestjs-swagger - Getting Started

Use this package to expose Swagger UI in a NestJS app without rewriting the
same bootstrap and auth wiring in each service.

## Register The Module

Import `SwaggerModule.forRoot()` so the OAuth2 redirect controller is present.
If the docs should be protected, register the matching `BasicAuthModule`
definition too.

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

## Attach Swagger Endpoints

Call `SwaggerModule.attachSwaggerEndpoints(...)` during bootstrap.

```ts
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@wisemen/nestjs-swagger'
import { AppModule } from './app.module.js'

const app = await NestFactory.create(AppModule)

await SwaggerModule.attachSwaggerEndpoints(app, {
  route: '/api/docs',
  servers: ['http://localhost:3000'],
  basicAuth: 'docs',
  oidcUrl: 'https://auth.example.com/.well-known/openid-configuration'
})
```

The package exposes the base docs route together with `/latest` and `/all`
variants and their JSON endpoints.

## Configure OAuth2 Login

Use `oidcUrl` to discover authorization settings automatically. Set
`redirectServer` when Swagger UI should point its OAuth2 redirect flow at a
specific public origin.
