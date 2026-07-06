import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { DataSource } from 'typeorm'
import { PostgresRateLimitStore } from './postgres-rate-limit.store.js'

const url = process.env.RATE_LIMIT_TEST_DATABASE_URL

describe('PostgresRateLimitStore (integration)', { skip: url == null }, () => {
  let ds: DataSource
  let store: PostgresRateLimitStore

  before(async () => {
    ds = new DataSource({ type: 'postgres', url })
    await ds.initialize()
    await ds.query('CREATE SCHEMA IF NOT EXISTS pgboss')
    store = new PostgresRateLimitStore(ds.manager)
    await store.ensureSchema()
    await ds.query(`DELETE FROM pgboss.rate_limit WHERE key = 'itest'`)
  })

  after(async () => {
    await ds?.destroy()
  })

  it('grants exactly `limit` tokens then blocks', async () => {
    const granted: boolean[] = []
    for (let i = 0; i < 4; i++) {
      granted.push(await store.tryConsumeToken('itest', 3, 60))
    }
    assert.deepEqual(granted, [true, true, true, false])
  })
})
