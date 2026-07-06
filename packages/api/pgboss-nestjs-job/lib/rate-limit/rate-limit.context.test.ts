import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { rateLimitStorage, currentRateLimitKey } from './rate-limit.context.js'

describe('rate-limit context', () => {
  it('has no key outside a run scope', () => {
    assert.equal(currentRateLimitKey(), undefined)
  })

  it('exposes the key inside a run scope', () => {
    rateLimitStorage.run({ key: 'stripe' }, () => {
      assert.equal(currentRateLimitKey(), 'stripe')
    })
  })

  it('propagates the key across an await', async () => {
    await rateLimitStorage.run({ key: 'stripe' }, async () => {
      await Promise.resolve()
      assert.equal(currentRateLimitKey(), 'stripe')
    })
  })

  it('isolates concurrent scopes with different keys', async () => {
    const seen: Array<string | undefined> = []

    async function record (key: string) {
      await rateLimitStorage.run({ key }, async () => {
        await Promise.resolve()
        seen.push(currentRateLimitKey())
      })
    }

    await Promise.all([record('a'), record('b')])

    assert.deepEqual([...seen].sort(), ['a', 'b'])
    assert.equal(currentRateLimitKey(), undefined)
  })
})
