---
name: getting-started
description: Use when exposing a small NestJS API status or build-info endpoint from resolved application config.
---

# @wisemen/nests-api-status - Getting Started

Use `ApiStatusModule.forRoot(...)` or `ApiStatusModule.forRootAsync(...)` to
expose a simple GET endpoint that returns environment and build metadata.

Resolve config in the application boundary, not inside the package.

## Register The Module

Use `forRootAsync(...)` when the values come from `ConfigService` or another
application dependency.

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiStatusModule } from '@wisemen/nests-api-status'

@Module({
  imports: [
    ApiStatusModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        environment: configService.getOrThrow('NODE_ENV'),
        commit: configService.getOrThrow('BUILD_COMMIT'),
        version: configService.getOrThrow('BUILD_NUMBER'),
        timestamp: configService.getOrThrow('BUILD_TIMESTAMP')
      }),
      controller: {
        isPublic: true
      }
    })
  ],
  exports: [ApiStatusModule]
})
export class StatusModule {}
```

Use `forRoot(...)` when the values are already available as static strings.

## Controller Options

Use controller options to adapt the endpoint to the consuming application:

- `route?`: optional controller route segment. Leave it undefined to mount at
  the module root.
- `swaggerTag?`: Swagger tag for the generated controller. Defaults to
  `API Status`.
- `versioning?`: Nest route version metadata. Defaults to `VERSION_NEUTRAL`.
- `isPublic?`: whether the generated route should be decorated with
  `@Public(...)`. Defaults to `false`.

Example:

```ts
ApiStatusModule.forRoot({
  environment: 'production',
  commit: '1a2b3c4d',
  version: '2026.07.23.1',
  timestamp: '2026-07-23T08:15:00.000Z',
  route: 'status',
  isPublic: true
})
```

## Response

The generated controller responds with `GetApiInfoResponse`:

```json
{
  "environment": "production",
  "commit": "1a2b3c4d",
  "version": "2026.07.23.1",
  "timestamp": "2026-07-23T08:15:00.000Z"
}
```
