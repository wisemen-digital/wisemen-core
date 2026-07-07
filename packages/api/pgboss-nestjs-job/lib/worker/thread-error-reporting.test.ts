import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isReportableError } from './pgboss-worker.thread.js'
import { RateLimitError } from '../rate-limit/rate-limit.error.js'

describe('isReportableError', () => {
  it('does not report a RateLimitError (expected, self-healing throttle)', () => {
    assert.equal(isReportableError(new RateLimitError({ throttled: true })), false)
  })

  it('reports genuine errors', () => {
    assert.equal(isReportableError(new Error('boom')), true)
    assert.equal(isReportableError('nope'), true)
  })
})
