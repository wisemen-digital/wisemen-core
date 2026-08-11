# @wisemen/nestjs-auth

Shared NestJS auth metadata helpers for marking routes as public and checking
that metadata from an `ExecutionContext`.

## Mark A Route As Public

Use `Public()` on a controller or handler to mark it as public. Pass `false` to
explicitly override public metadata inherited from a controller class.

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

  @Get('private')
  @Public(false)
  getPrivateStatus(): string {
    return 'private'
  }
}
```

## Check Public Metadata

Use `isPublicContext(...)` inside guards or interceptors so applications do not
need to know the metadata key or reimplement the override semantics.

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { isPublicContext } from '@wisemen/nestjs-auth'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (isPublicContext(context)) {
      return true
    }

    return true
  }
}
```

`isPublicContext(...)` checks handler metadata first, then controller metadata,
and falls back to `false` when neither is defined.

## Register Basic Auth Definitions

Import `BasicAuthModule.forRoot()` once to initialize the shared registry, then
use `BasicAuthModule.forFeature(...)` or `BasicAuthModule.forFeatureAsync(...)`
in feature-local modules to register the definitions they need close to their
controllers.

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [
    BasicAuthModule.forRoot()
  ]
})
export class ApiModule {}
```

```ts
import { Module } from '@nestjs/common'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [
    BasicAuthModule.forFeature({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    })
  ]
})
export class DocsModule {}
```

```ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BasicAuthModule } from '@wisemen/nestjs-auth'

@Module({
  imports: [
    BasicAuthModule.forFeatureAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        docs: {
          username: config.getOrThrow('DOCS_USERNAME'),
          password: config.getOrThrow('DOCS_PASSWORD')
        }
      })
    })
  ]
})
export class DocsModule {}
```
