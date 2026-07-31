# @wisemen/nestjs-http-exception-filter

Shared NestJS HTTP exception filter that maps thrown errors to JSON:API error
responses, emits a trace id when available, and can optionally redact 500-level
error details.

## Register The Module

Use `HttpExceptionFilterModule.forRoot(...)` for static options or
`HttpExceptionFilterModule.forRootAsync(...)` when the application decides the
filter behavior from config.

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
    } satisfies HttpExceptionFilterModuleAsyncOptions)
  ]
})
export class ExceptionModule {}
```

## Module Options

- `hideInternalServerErrorDetails?`: when `true`, replace all 500-level error
  details with the configured fallback message. Defaults to `false`.
- `internalServerErrorMessage?`: fallback detail message used when redaction is
  enabled. Defaults to `DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE`.

## Behavior

The filter preserves existing `JsonApiError`, `CompositeApiError`, and
`ApiError` instances. It also maps:

- `HttpException` -> `JsonApiError`
- `EntityNotFoundError` -> empty 404 `JsonApiError`
- unknown errors -> `InternalServerApiError`

For 500-level responses, the filter also calls `captureException(...)` and adds
`traceId` to the response body when an active span exists.
