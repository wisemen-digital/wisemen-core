import type {
  AuditableLogger,
  AuditActor,
  AuditInput,
  DrainFn,
  LoggerConfig,
  SamplingConfig,
} from 'evlog'
import {
  createLogger,
  drainPlugin,
  initLogger,
} from 'evlog'

import {
  getPayloadAuditActor,
  systemActor,
} from '#payload/payloadAuditContext.ts'

export const SLOW_REQUEST_KEEP_MS = 3000

export interface SlowRequestOptions {
  durationMs: number
}

const defaultSlowRequestOptions: SlowRequestOptions = {
  durationMs: SLOW_REQUEST_KEEP_MS,
}

let slowRequestOptions = defaultSlowRequestOptions

export const loggingRedaction = {
  paths: [
    '**.authorization',
    '**.password',
    '**.secret',
    '**.token',
    '**.accessToken',
    '**.refreshToken',
    '**.apiKey',
    '**.api_key',
  ],
}

export interface InitializeLoggingOptions {
  /** A dedicated sink for audit events. Normal application logs still use stdout. */
  auditDrain?: DrainFn
  environment?: string
  sampling?: SamplingConfig
  service: string
  slowRequest?: Partial<SlowRequestOptions>
}

export interface ApplicationLogFields {
  eventSource: 'application'
}

export interface ApplicationAuditMethod {
  (input: Omit<AuditInput, 'actor'> & {
    actor?: AuditActor
  }): void
  deny: (reason: string, input: Omit<AuditInput, 'actor' | 'outcome' | 'reason'> & {
    actor?: AuditActor
  }) => void
}

export type ApplicationLogger = Omit<AuditableLogger<ApplicationLogFields & Record<string, unknown>>, 'audit'> & {
  audit: ApplicationAuditMethod
}

/** Configure Evlog sampling and redaction for request-wide events. */
export function initializeLogging({
  auditDrain,
  environment = 'development',
  sampling,
  service,
  slowRequest,
}: InitializeLoggingOptions): void {
  slowRequestOptions = resolveSlowRequestOptions(slowRequest)

  const config: LoggerConfig = {
    env: {
      environment,
      service,
    },
    plugins: auditDrain
      ? [
          drainPlugin('wisemen-audit-drain', auditDrain),
        ]
      : undefined,
    pretty: environment !== 'production',
    redact: loggingRedaction,
    sampling: resolveLoggingSampling(slowRequestOptions, sampling),
  }

  initLogger(config)
}

/**
 * Create one Evlog event for application code using the package's shared
 * configuration. Call `emit()` after the operation completes.
 */
export function createApplicationLogger(): ApplicationLogger {
  const log = createLogger<ApplicationLogFields & Record<string, unknown>>()

  log.set({
    eventSource: 'application',
  })

  const audit = log.audit
  const auditWithRequestActor = ((input) => {
    audit({
      ...input,
      actor: input.actor ?? getPayloadAuditActor() ?? systemActor,
    })
  }) as ApplicationAuditMethod

  auditWithRequestActor.deny = (reason, input) => {
    audit.deny(reason, {
      ...input,
      actor: input.actor ?? getPayloadAuditActor() ?? systemActor,
    })
  }
  log.audit = auditWithRequestActor

  return log as ApplicationLogger
}

/** Resolve default sampling while allowing each service to override its policy. */
export function resolveLoggingSampling(
  slowRequest: SlowRequestOptions,
  overrides: SamplingConfig = {},
): SamplingConfig {
  return {
    keep: overrides.keep ?? [
      {
        duration: slowRequest.durationMs,
      },
      {
        status: 400,
      },
    ],
    rates: {
      debug: 0,
      error: 100,
      info: 10,
      warn: 50,
      ...overrides.rates,
    },
  }
}

export function getSlowRequestOptions(): SlowRequestOptions {
  return slowRequestOptions
}

export function resolveSlowRequestOptions(
  options: Partial<SlowRequestOptions> = {},
): SlowRequestOptions {
  const resolved = {
    ...defaultSlowRequestOptions,
    ...options,
  }

  if (resolved.durationMs < 0) {
    throw new Error('slowRequest.durationMs cannot be negative.')
  }

  return resolved
}

const MAX_ARRAY_LENGTH = 50
const MAX_OBJECT_KEYS = 50
const MAX_STRING_LENGTH = 2000
const MAX_DEPTH = 6

/** Bound arbitrary request input before Evlog applies its redaction policy. */
export function limitLoggingValue(value: unknown, depth = 0): unknown {
  if (depth >= MAX_DEPTH) {
    return '[TRUNCATED: maximum depth]'
  }

  if (typeof value === 'string') {
    return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}[TRUNCATED]` : value
  }

  if (value == null || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    const items = value.slice(0, MAX_ARRAY_LENGTH).map((item) => limitLoggingValue(item, depth + 1))

    return value.length > MAX_ARRAY_LENGTH
      ? [
          ...items,
          `[TRUNCATED: ${value.length - MAX_ARRAY_LENGTH} additional items]`,
        ]
      : items
  }

  if (typeof value === 'object') {
    const limited: Record<string, unknown> = {}
    const entries = Object.entries(value).slice(0, MAX_OBJECT_KEYS)

    for (const [
      key,
      nestedValue,
    ] of entries) {
      limited[key] = limitLoggingValue(nestedValue, depth + 1)
    }

    const keyCount = Object.keys(value).length

    if (keyCount > MAX_OBJECT_KEYS) {
      limited._truncatedKeys = keyCount - MAX_OBJECT_KEYS
    }

    return limited
  }

  return String(value)
}
