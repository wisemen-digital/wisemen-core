import { type ArgumentsHost, Catch, HttpException, HttpStatus, Inject, type ExceptionFilter } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { trace } from '@opentelemetry/api'
import { JsonApiError, ApiError, CompositeApiError, InternalServerApiError } from '@wisemen/api-error'
import { captureException } from '@wisemen/opentelemetry'
import { EntityNotFoundError } from 'typeorm'
import { MODULE_OPTIONS_TOKEN } from './http-exception-filter.module-definition.js'
import { resolveHttpExceptionFilterModuleOptions } from './http-exception-filter.module-options.js'
import type { HttpExceptionFilterModuleOptions } from './http-exception-filter.module-options.js'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor (
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: HttpExceptionFilterModuleOptions = {}
  ) {}

  catch (error: Error, host: ArgumentsHost): void {
    const options = resolveHttpExceptionFilterModuleOptions(this.options)
    const mappedError = this.mapError(error)
    let errors = mappedError.errors

    if (mappedError.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      captureException(error)

      if (options.hideInternalServerErrorDetails) {
        errors = errors.map(jsonApiError => ({
          ...jsonApiError,
          detail: options.internalServerErrorMessage
        }))
      }
    }

    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()

    httpAdapter.reply(
      ctx.getResponse(),
      { errors, traceId: trace.getActiveSpan()?.spanContext()?.traceId ?? null },
      mappedError.status
    )
  }

  private mapError (error: Error): JsonApiError {
    if (error instanceof JsonApiError) {
      return error
    }

    if (error instanceof CompositeApiError) {
      return error.toJsonApiError()
    }

    if (error instanceof ApiError) {
      return error.toJsonApiError()
    }

    if (error instanceof HttpException) {
      return this.mapHttpExceptionToJsonApiError(error)
    }

    if (error instanceof EntityNotFoundError) {
      return new JsonApiError(HttpStatus.NOT_FOUND, [{ code: 'not_found', status: '404' }])
    }

    return new InternalServerApiError(error.message).toJsonApiError()
  }

  private mapHttpExceptionToJsonApiError (exception: HttpException): JsonApiError {
    return new JsonApiError(
      exception.getStatus(),
      [{
        status: exception.getStatus().toString(),
        code: exception.name,
        detail: exception.message
      }]
    )
  }
}
