import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { isKnownNoiseSpan } from '../noise-span-filter.js'

function spanNamed (name: string): ReadableSpan {
  return { name } as ReadableSpan
}

describe('isKnownNoiseSpan', () => {
  it('matches the redis ping span emitted by the current response hook', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('[Redis] PING')), true)
  })

  it('matches the trailing space left by older response hooks', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('[Redis] PING ')), true)
  })

  it('matches the raw instrumentation name used without a response hook', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('redis-PING')), true)
  })

  it('keeps other redis commands', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('[Redis] GET')), false)
  })

  it('keeps spans whose name merely contains a noise name', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('[Redis] PING user-session')), false)
  })
})
