import { createLogger } from 'evlog'

import { limitLoggingValue } from '#logging/logging.ts'

interface JobLoggingArguments {
  input?: unknown
  job: {
    id: number | string
    input?: unknown
    queue?: string | null
    taskSlug?: string | null
    totalTried?: number | null
    workflowSlug?: string | null
  }
}

interface JobDefinition {
  handler: unknown
  slug: string
}

export type JobOperationType = 'task' | 'workflow'

interface JobLogFields {
  job: {
    id: string
    input: unknown
    queue?: string
    taskSlug?: string
    totalTried?: number | null
    workflowSlug?: string
  }
  operation: string
  operationType: JobOperationType
}

/**
 * Record one Evlog wide event for a Payload task or workflow execution.
 * Slow successful jobs are retained by the global tail-sampling duration rule.
 */
export function withJobLogging<TDefinition extends JobDefinition>(
  definitions: TDefinition[],
  type: JobOperationType,
): TDefinition[]
export function withJobLogging<TDefinition extends JobDefinition>(
  definition: TDefinition,
  type: JobOperationType,
): TDefinition

/** Wrap every task or workflow in a registry while preserving its config type. */
export function withJobLogging<TDefinition extends JobDefinition>(
  definitions: TDefinition | TDefinition[],
  type: JobOperationType,
): TDefinition | TDefinition[] {
  if (Array.isArray(definitions)) {
    return definitions.map((definition) => wrapJobLoggingDefinition(definition, type))
  }

  return wrapJobLoggingDefinition(definitions, type)
}

function wrapJobLoggingDefinition<TDefinition extends JobDefinition>(
  definition: TDefinition,
  type: JobOperationType,
): TDefinition {
  if (typeof definition.handler !== 'function') {
    return definition
  }

  const handler = definition.handler as (arguments_: JobLoggingArguments) => unknown

  return {
    ...definition,
    handler: async (arguments_: JobLoggingArguments): Promise<unknown> => {
      const {
        input, job,
      } = arguments_
      const log = createLogger<JobLogFields>()

      log.set({
        job: {
          id: String(job.id),
          input: limitLoggingValue(input ?? job.input),
          queue: job.queue ?? undefined,
          taskSlug: job.taskSlug ?? undefined,
          totalTried: job.totalTried,
          workflowSlug: job.workflowSlug ?? undefined,
        },
        operation: definition.slug,
        operationType: type,
      })

      try {
        return await handler(arguments_)
      }
      catch (error) {
        log.error(error instanceof Error ? error : String(error))

        throw error
      }
      finally {
        log.emit()
      }
    },
  }
}
