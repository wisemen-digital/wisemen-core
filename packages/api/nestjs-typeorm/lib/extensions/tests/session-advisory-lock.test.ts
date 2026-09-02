import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createStubInstance, stub } from 'sinon'
import { DataSource } from 'typeorm'
import type { QueryRunner } from 'typeorm'
import { advisoryLock, tryAdvisoryLock } from '../session-advisory-lock.js'

type QueryCall = { query: string, values: unknown[] | undefined }

function createDataSource (acquireResult: unknown): {
  dataSource: DataSource,
  queryCalls: QueryCall[],
  getReleaseCalls: () => number
} {
  const queryCalls: QueryCall[] = []
  let releaseCalls = 0

  const query = stub<[query: string, values?: unknown[]], Promise<unknown>>().callsFake((statement, values) => {
    queryCalls.push({ query: statement, values })

    return Promise.resolve(queryCalls.length === 1 ? acquireResult : [])
  })
  const release = stub<[], Promise<void>>().callsFake(() => {
    releaseCalls += 1

    return Promise.resolve()
  })
  const queryRunner = {
    query,
    release
  } as unknown as QueryRunner

  const dataSource = createStubInstance(DataSource)
  dataSource.createQueryRunner.returns(queryRunner)

  return { dataSource, queryCalls, getReleaseCalls: () => releaseCalls }
}

describe('advisoryLock and tryAdvisoryLock', () => {
  it('returns an unacquired result without invoking the callback or unlocking a contended non-blocking lock', async () => {
    const lock = createDataSource([{ locked: false }])
    let callbackCalls = 0

    const result = await tryAdvisoryLock(lock.dataSource, 'excl', 10, () => {
      callbackCalls += 1
      return Promise.resolve('completed')
    })

    assert.deepEqual(result, { acquired: false })
    assert.equal(callbackCalls, 0)
    assert.deepEqual(lock.queryCalls, [{
      query: 'SELECT pg_try_advisory_lock($1) AS locked',
      values: [10]
    }])
    assert.equal(lock.getReleaseCalls(), 1)
  })

  it('uses shared two-key queries for a non-blocking lock', async () => {
    const lock = createDataSource([{ locked: true }])

    const result = await advisoryLock(lock.dataSource, 'try-lock', 'shared', 3, 7, () =>
      Promise.resolve(null)
    )

    assert.deepEqual(result, { acquired: true, value: null })
    assert.deepEqual(lock.queryCalls, [
      {
        query: 'SELECT pg_try_advisory_lock_shared($1, $2) AS locked',
        values: [3, 7]
      },
      {
        query: 'SELECT pg_advisory_unlock_shared($1, $2)',
        values: [3, 7]
      }
    ])
    assert.equal(lock.getReleaseCalls(), 1)
  })

  it('uses exclusive two-key queries for a blocking lock', async () => {
    const lock = createDataSource([])

    const result = await advisoryLock(lock.dataSource, 'blocking', 'excl', 3, 7, () => {
      return Promise.resolve('completed')
    })

    assert.equal(result, 'completed')
    assert.deepEqual(lock.queryCalls, [
      {
        query: 'SELECT pg_advisory_lock($1, $2)',
        values: [3, 7]
      },
      {
        query: 'SELECT pg_advisory_unlock($1, $2)',
        values: [3, 7]
      }
    ])
    assert.equal(lock.getReleaseCalls(), 1)
  })

  it('uses shared single-key queries for a blocking lock', async () => {
    const lock = createDataSource([])

    const result = await advisoryLock(lock.dataSource, 'blocking', 'shared', 10, () => {
      Promise.resolve('completed')
    })

    assert.equal(result, 'completed')
    assert.deepEqual(lock.queryCalls, [
      {
        query: 'SELECT pg_advisory_lock_shared($1)',
        values: [10]
      },
      {
        query: 'SELECT pg_advisory_unlock_shared($1)',
        values: [10]
      }
    ])
    assert.equal(lock.getReleaseCalls(), 1)
  })
})
