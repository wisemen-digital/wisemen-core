---
name: getting-started
description: Use when marking NestJS routes as public or protecting controllers, handlers, and docs endpoints with shared basic auth from @wisemen/nestjs-auth.
---

# @wisemen/nestjs-auth - Getting Started

Use this package for two separate concerns:

- mark routes as public with `Public()`
- protect routes with shared HTTP basic auth definitions

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
