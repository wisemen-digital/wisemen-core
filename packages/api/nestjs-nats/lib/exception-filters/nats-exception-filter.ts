import type { ExceptionFilter, Type } from '@nestjs/common'
import type { NatsArgumentsHost } from './nats-arguments-host.js'

export interface NatsServiceErrorResponse {
  code: number
  description: string
  data?: string
}

export interface NatsExceptionFilter<T = unknown, TResult = unknown> extends ExceptionFilter<T> {
  catch (exception: T, host: NatsArgumentsHost): TResult | Promise<TResult>
}

export interface ResolvedNatsExceptionFilter {
  exceptions: Type<unknown>[]
  filter: NatsExceptionFilter
}

export function isNatsServiceErrorResponse (value: unknown): value is NatsServiceErrorResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const response = value as Partial<NatsServiceErrorResponse>

  return typeof response.code === 'number' && typeof response.description === 'string'
}
