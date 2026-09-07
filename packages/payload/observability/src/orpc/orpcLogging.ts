import type {
  Context,
  MiddlewareOptions,
  MiddlewareResult,
} from '@orpc/server'
import type { RequestLogger } from 'evlog'
import type { EvlogOrpcContext } from 'evlog/orpc'
import { withEvlog } from 'evlog/orpc'

import type { InitializeLoggingOptions } from '#logging/logging.ts'
import {
  initializeLogging,
  limitLoggingValue,
  loggingRedaction,
} from '#logging/logging.ts'
import { getActiveTraceLogContext } from '#opentelemetry/traceContext.ts'

export { withEvlog as withOrpcLogging }
export type OrpcLoggingContext = EvlogOrpcContext

export interface LoggingUser {
  id: string
  role?: string | null
}

interface OrpcMiddlewareContext {
  log?: RequestLogger
  user?: LoggingUser | null
}

function addTraceContext(log: RequestLogger | undefined): void {
  const traceContext = getActiveTraceLogContext()

  if (traceContext != null) {
    log?.set(traceContext)
  }
}

/** Initialize Evlog and return the middleware needed for oRPC procedures. */
export function initializeOrpcLogging(options: InitializeLoggingOptions): typeof orpcLoggingMiddleware {
  initializeLogging(options)

  return orpcLoggingMiddleware
}

/** Capture RPC input and caller details on Evlog's request-wide event. */
export async function orpcLoggingMiddleware<
  TContext extends OrpcMiddlewareContext & Context = OrpcMiddlewareContext & Context,
>(
  {
    context,
    next,
    path,
  }: MiddlewareOptions<TContext, unknown, any, any>,
  input: unknown,
): Promise<MiddlewareResult<Record<never, never>, unknown>> {
  const operation = path.join('.')

  context.log?.set({
    operation,
    rpc: {
      input: limitLoggingValue(input),
      operation,
    },
    user: context.user == null
      ? undefined
      : {
          id: context.user.id,
          role: context.user.role ?? undefined,
        },
  })
  addTraceContext(context.log)

  try {
    return await next()
  }
  catch (error) {
    addTraceContext(context.log)
    context.log?.error(error instanceof Error ? error : String(error))

    throw error
  }
}

export const orpcLoggingOptions = {
  redact: loggingRedaction,
}
