import type { Attributes } from '@opentelemetry/api'
import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

const NOISE_SPAN_NAMES = new Set(['[Redis] PING', 'redis-PING'])
const SYSTEM_ATTRIBUTE_NAMES = ['db.system', 'db.system.name'] as const
const STATEMENT_ATTRIBUTE_NAMES = ['db.statement', 'db.query.text'] as const

export function isKnownNoiseSpan (span: ReadableSpan): boolean {
  return isRedisPing(span.attributes) || NOISE_SPAN_NAMES.has(trimmed(span.name))
}

function isRedisPing (attributes: Attributes | undefined): boolean {
  if (attributes == null) {
    return false
  }

  return SYSTEM_ATTRIBUTE_NAMES.some(name => attributes[name] === 'redis')
    && STATEMENT_ATTRIBUTE_NAMES.some(name => trimmed(attributes[name]).toUpperCase() === 'PING')
}

function trimmed (value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
