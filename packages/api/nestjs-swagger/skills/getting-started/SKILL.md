---
name: getting-started
description: Use when attaching Swagger UI and OpenAPI endpoints to a NestJS app with optional basic auth and OpenID Connect configuration through @wisemen/nestjs-swagger.
---

# @wisemen/nestjs-swagger - Getting Started

Use this package to expose Swagger UI in a NestJS app without rewriting the
same controller, static asset, and auth wiring in each service.

## Register The Module

Import `SwaggerModule.forRoot()` so the Swagger controller and OAuth2 redirect
route are present. If the docs should be protected, register the matching
`BasicAuthModule` definition too.

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

## Write Swagger JSON Docs

Call `SwaggerModule.writeSwaggerJsonDocs(...)` during bootstrap or build-time.

```ts
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@wisemen/nestjs-swagger'
import { AppModule } from './app.module.js'

const app = await NestFactory.create(AppModule)

await SwaggerModule.writeSwaggerJsonDocs(app, {
  servers: ['http://localhost:3000'],
  oidcUrl: 'https://auth.example.com/.well-known/openid-configuration'
})
```

The package serves the base docs route together with `/latest` and `/all`
variants and their JSON endpoints from the generated files once the docs have
been written.

## Configure OAuth2 Login

Use `oidcUrl` to discover authorization settings automatically. Set
`redirectServer` when Swagger UI should point its OAuth2 redirect flow at a
specific public origin.
