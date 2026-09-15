import type { Attributes } from '@opentelemetry/api'
import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { isKnownNoiseSpan } from '../noise-span-filter.js'

function spanNamed (name: string, attributes?: Attributes): ReadableSpan {
  return { name, attributes } as ReadableSpan
}

describe('isKnownNoiseSpan', () => {
  it('matches a ping regardless of the span name', () => {
    const span = spanNamed('whatever-the-hook-named-it', {
      'db.statement': 'PING ',
      'db.system': 'redis'
    })

    assert.strictEqual(isKnownNoiseSpan(span), true)
  })

  it('matches the raw instrumentation name used without a response hook', () => {
    const span = spanNamed('redis-PING', { 'db.statement': 'PING ', 'db.system': 'redis' })

    assert.strictEqual(isKnownNoiseSpan(span), true)
  })

  it('matches the stable semantic convention attribute names', () => {
    const span = spanNamed('redis-PING', {
      'db.query.text': 'PING',
      'db.system.name': 'redis'
    })

    assert.strictEqual(isKnownNoiseSpan(span), true)
  })

  it('keeps other redis commands', () => {
    const span = spanNamed('[Redis] GET', {
      'db.statement': 'GET user-session',
      'db.system': 'redis'
    })

    assert.strictEqual(isKnownNoiseSpan(span), false)
  })

  it('matches the connect span, which carries no statement', () => {
    const span = spanNamed('redis-connect', { 'db.system': 'redis' })

    assert.strictEqual(isKnownNoiseSpan(span), true)
  })

  it('matches the connect span on the stable system attribute', () => {
    const span = spanNamed('redis-connect', { 'db.system.name': 'redis' })

    assert.strictEqual(isKnownNoiseSpan(span), true)
  })

  it('keeps a postgres span carrying no statement', () => {
    const span = spanNamed('connect', { 'db.system': 'postgresql' })

    assert.strictEqual(isKnownNoiseSpan(span), false)
  })

  it('ignores a ping statement from another database system', () => {
    const span = spanNamed('pg.query:PING', {
      'db.statement': 'PING',
      'db.system': 'postgresql'
    })

    assert.strictEqual(isKnownNoiseSpan(span), false)
  })

  it('keeps spans carrying no attributes', () => {
    assert.strictEqual(isKnownNoiseSpan(spanNamed('[Redis] PING')), false)
  })
})
