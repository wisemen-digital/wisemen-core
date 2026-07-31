---
name: getting-started
description: Use when registering a shared NestJS HTTP exception filter that returns JSON:API errors and optionally redacts 500-level details.
---

# @wisemen/nestjs-http-exception-filter - Getting Started

Use `HttpExceptionFilterModule.forRoot(...)` or
`HttpExceptionFilterModule.forRootAsync(...)` to register a global NestJS
exception filter that:

- preserves `@wisemen/api-error` instances
- maps `HttpException` and `EntityNotFoundError` into JSON:API errors
- includes an OpenTelemetry trace id when one is active
- optionally hides 500-level error details behind a fallback message

## Register The Module

Resolve config at the application boundary and pass it into the module.

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  HttpExceptionFilterModule,
  type HttpExceptionFilterModuleAsyncOptions,
  type HttpExceptionFilterModuleOptions
} from '@wisemen/nestjs-http-exception-filter'
import { EnvType } from '#src/modules/config/env.enum.js'

@Module({
  imports: [
    HttpExceptionFilterModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): HttpExceptionFilterModuleOptions => ({
        hideInternalServerErrorDetails: configService.getOrThrow('NODE_ENV') === EnvType.PRODUCTION
      })
    })
  ]
})
export class ExceptionModule {}
```

Use `forRoot(...)` when the values are already known statically.

## Configure Redaction

Use the module options to control how 500-level errors are exposed:

- `hideInternalServerErrorDetails?`: defaults to `false`
- `internalServerErrorMessage?`: defaults to
  `DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE`

Example:

```ts
HttpExceptionFilterModule.forRoot({
  hideInternalServerErrorDetails: true,
  internalServerErrorMessage: 'Something went wrong. Please try again later.'
})
```

## Error Mapping

The filter keeps `JsonApiError`, `CompositeApiError`, and `ApiError` untouched.
It also maps:

- `HttpException` into a `JsonApiError`
- `EntityNotFoundError` into an empty 404 response
- unknown errors into `InternalServerApiError`

The response body always has this shape:

```json
{
  "errors": [],
  "traceId": null
}
```

When a span is active, `traceId` contains the current OpenTelemetry trace id.
