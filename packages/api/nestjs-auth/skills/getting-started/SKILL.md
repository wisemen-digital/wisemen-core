---
name: getting-started
description: Use when marking NestJS controllers or handlers as public and when checking public-route metadata in guards.
---

# @wisemen/nestjs-auth - Getting Started

Use `Public()` to mark a controller or handler as public and
`isPublicContext(context)` inside guards or interceptors to evaluate the
related metadata without depending on the raw metadata key.

## Mark Public Routes

Apply `Public()` at the class or method level. `Public(false)` explicitly marks
the target as non-public and overrides a `Public()` annotation applied higher in
the controller hierarchy.

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

Use `Public(false)` only when you intentionally need a method-level override.

## Check Public Metadata In A Guard

Use `isPublicContext(...)` from a guard instead of reading metadata keys
directly.

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common'
import { isPublicContext } from '@wisemen/nestjs-auth'
import { AuthContext } from '#src/modules/auth/auth.context.js'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly authContext: AuthContext
  ) {}

  canActivate (context: ExecutionContext): boolean {
    if (isPublicContext(context)) {
      return true
    }

    this.authContext.getAuthOrFail()

    return true
  }
}
```

`isPublicContext(...)` mirrors Nest's "handler overrides controller" behavior:

- handler metadata wins when defined
- controller metadata is used when the handler has no public metadata
- the default is `false`
