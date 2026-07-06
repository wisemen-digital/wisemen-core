import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgBossWorkerThread } from './pgboss-worker.thread.js'
import { currentRateLimitKey } from '../rate-limit/rate-limit.context.js'

function threadFor (job: object, onRun: () => void) {
  function* one () { yield job as never }
  const client = { complete: () => Promise.resolve(), fail: () => Promise.resolve() }
  const registry = { get: () => Promise.resolve({ run: () => { onRun(); return Promise.resolve() } }) }

  return new PgBossWorkerThread(one() as never, client as never, registry as never)
}

describe('PgBossWorkerThread rate-limit context', () => {
  it('exposes the job group as the rate-limit key while the handler runs', async () => {
    let seen: string | undefined = 'unset'
    const job = { id: '1', name: 'system', groupId: 'stripe', data: { className: 'ChargeJob', classData: {} } }

    await threadFor(job, () => { seen = currentRateLimitKey() }).run()

    assert.equal(seen, 'stripe')
  })

  it('has no rate-limit key for a job without a group', async () => {
    let seen: string | undefined = 'unset'
    const job = { id: '1', name: 'system', data: { className: 'PlainJob', classData: {} } }

    await threadFor(job, () => { seen = currentRateLimitKey() }).run()

    assert.equal(seen, undefined)
  })
})
