# @wisemen/nests-api-status

Shared NestJS module for exposing build and runtime metadata through a simple
HTTP endpoint.

## Register The Module

Resolve your environment values in the application boundary and pass them into
`ApiStatusModule.forRoot(...)` or `ApiStatusModule.forRootAsync(...)`.

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
      isPublic: true
    })
  ]
})
export class StatusModule {}
```

## Module Options

`ApiStatusModuleOptions`

- `environment`: environment name returned by the endpoint.
- `commit`: build commit SHA returned by the endpoint.
- `version`: build number or application version returned by the endpoint.
- `timestamp`: build timestamp returned by the endpoint.

`ApiStatusControllerOptions`

- `route?`: optional controller route segment. When omitted, the endpoint is mounted at the module root.
- `swaggerTag?`: optional Swagger tag. Defaults to `API Status`.
- `versioning?`: optional Nest route version metadata. Defaults to `VERSION_NEUTRAL`.
- `isPublic?`: whether the endpoint should be marked with `@Public(...)`. Defaults to `false`.

## Response Shape

The endpoint returns `GetApiInfoResponse`:

```json
{
  "environment": "production",
  "commit": "1a2b3c4d",
  "version": "2026.07.23.1",
  "timestamp": "2026-07-23T08:15:00.000Z"
}
```
