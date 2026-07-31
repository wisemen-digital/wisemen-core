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
