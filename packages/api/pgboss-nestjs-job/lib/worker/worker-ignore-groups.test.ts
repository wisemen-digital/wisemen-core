import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgBossWorker } from './pgboss-worker.js'

describe('PgBossWorker fetch gating', () => {
  it('passes blockedKeys as ignoreGroups to client.fetch', async () => {
    const fetchCalls: Array<{ name: string, options: unknown }> = []

    const client = {
      fetch: (name: string, options: unknown) => {
        fetchCalls.push({ name, options })

        return Promise.resolve([])
      }
    }
    const rateLimiter = { blockedKeys: () => ['stripe'] }

    const worker = new PgBossWorker(
      { queueName: 'system', pollInterval: 1 },
      { canProceed: () => true },
      client as never,
      { } as never,
      rateLimiter as never
    )

    // fetchJobs() early-returns unless the worker is "working"; set the flag
    // directly since we call the private method without start()/threads.
    ;(worker as unknown as { working: boolean }).working = true
    await (worker as unknown as { fetchJobs: () => Promise<void> }).fetchJobs()

    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].name, 'system')
    assert.deepEqual((fetchCalls[0].options as { ignoreGroups: string[] }).ignoreGroups, ['stripe'])
  })
})
