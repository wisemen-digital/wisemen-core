import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

// Names are trimmed: older versions appended the first command argument, leaving
// a trailing space on argumentless commands.
const KNOWN_NOISE_SPAN_NAMES = new Set([
  '[Redis] PING',
  'redis-PING'
])

export function isKnownNoiseSpan (span: ReadableSpan): boolean {
  return KNOWN_NOISE_SPAN_NAMES.has(span.name.trim())
}
