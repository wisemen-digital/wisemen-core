import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

const SYSTEM_ATTRIBUTE_NAMES = ['db.system', 'db.system.name'] as const
const STATEMENT_ATTRIBUTE_NAMES = ['db.statement', 'db.query.text'] as const

export function isKnownNoiseSpan (span: ReadableSpan): boolean {
  const { attributes } = span

  if (attributes == null) {
    return false
  }

  if (!SYSTEM_ATTRIBUTE_NAMES.some(name => attributes[name] === 'redis')) {
    return false
  }

  const statement = STATEMENT_ATTRIBUTE_NAMES
    .map(name => trimmed(attributes[name]))
    .find(value => value !== '')

  // A redis span without a statement is the connect span.
  return statement === undefined || statement.toUpperCase() === 'PING'
}

function trimmed (value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
