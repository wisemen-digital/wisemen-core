import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { BaseJob } from '../jobs/base-job.js'
import { resolveGroupId } from './resolve-group-id.js'

class ChargeJob extends BaseJob {
  constructor () {
    super({}, { rateLimited: 'stripe' })
  }
}

class PlainJob extends BaseJob {}

describe('resolveGroupId', () => {
  it('returns the rate-limit key a job opted into', () => {
    assert.equal(resolveGroupId(new ChargeJob()), 'stripe')
  })

  it('returns undefined for a job with no rate limit', () => {
    assert.equal(resolveGroupId(new PlainJob()), undefined)
  })
})
