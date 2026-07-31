import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import { DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE } from './http-exception-filter.constants.js'

/**
 * Runtime options that control how the shared exception filter exposes 500-level
 * errors to API consumers.
 */
export interface HttpExceptionFilterModuleOptions {
  /**
   * When `true`, replace the detail of every 500-level JSON:API error with the
   * configured fallback message.
   *
   * Defaults to `false`.
   */
  hideInternalServerErrorDetails?: boolean

  /**
   * Fallback message used when internal server error details are redacted.
   *
   * Defaults to `DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE`.
   */
  internalServerErrorMessage?: string
}

/**
 * Async registration options for `HttpExceptionFilterModule.forRootAsync(...)`.
 */
export interface HttpExceptionFilterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<HttpExceptionFilterModuleOptions> | HttpExceptionFilterModuleOptions
  inject?: FactoryProvider['inject']
}

export interface ResolvedHttpExceptionFilterModuleOptions {
  hideInternalServerErrorDetails: boolean
  internalServerErrorMessage: string
}

export function resolveHttpExceptionFilterModuleOptions (
  options: HttpExceptionFilterModuleOptions = {}
): ResolvedHttpExceptionFilterModuleOptions {
  return {
    hideInternalServerErrorDetails: options.hideInternalServerErrorDetails ?? false,
    internalServerErrorMessage: options.internalServerErrorMessage ?? DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE
  }
}
