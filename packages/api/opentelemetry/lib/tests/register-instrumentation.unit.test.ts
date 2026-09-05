import http from 'http'
import https from 'https'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { registerInstrumentation } from '../register-instrumentation.js'

function isPatched (fn: unknown): boolean {
  const candidate = fn as Record<string, unknown> | undefined

  return candidate?.['__wrapped'] === true || typeof candidate?.['__original'] === 'function'
}

describe('registerInstrumentation', () => {
  it('patches modules that were loaded before it ran', () => {
    assert.strictEqual(
      isPatched(http.Server.prototype.emit),
      false,
      'precondition: http must start out unpatched, otherwise this test proves nothing'
    )

    registerInstrumentation()

    assert.strictEqual(isPatched(http.Server.prototype.emit), true)
    assert.strictEqual(isPatched(https.request), true)
  })

  it('is safe to run a second time', () => {
    registerInstrumentation()

    assert.strictEqual(isPatched(http.Server.prototype.emit), true)
  })
})
