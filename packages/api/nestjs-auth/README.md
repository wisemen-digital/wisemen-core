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
