import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler'
import {
  createThrottlerModuleOptions
} from './api-throttler.module.js'
import {
  API_DEFAULT_THROTTLE_LIMIT,
  API_DEFAULT_THROTTLE_TTL
} from './api-throttler.constant.js'

describe('createThrottlerModuleOptions', () => {
  it('uses the NestJS in-memory storage and package defaults', () => {
    const options = asObjectOptions(createThrottlerModuleOptions({}))

    assert.deepEqual(options.throttlers, [{
      limit: API_DEFAULT_THROTTLE_LIMIT,
      ttl: API_DEFAULT_THROTTLE_TTL
    }])
    assert.equal('storage' in options, false)
  })

  it('forwards throttler configuration', () => {
    const options = asObjectOptions(createThrottlerModuleOptions({
      throttler: {
        blockDuration: 10_000,
        limit: 5,
        name: 'short',
        setHeaders: false,
        ttl: 30_000
      }
    }))

    assert.deepEqual(options.throttlers, [{
      blockDuration: 10_000,
      limit: 5,
      name: 'short',
      setHeaders: false,
      ttl: 30_000
    }])
  })

  it('uses a custom storage implementation', () => {
    const storage: ThrottlerStorage = {
      increment: () => Promise.resolve({
        isBlocked: false,
        timeToBlockExpire: 0,
        timeToExpire: 60,
        totalHits: 1
      })
    }

    const options = asObjectOptions(createThrottlerModuleOptions({ storage }))

    assert.equal(options.storage, storage)
  })
})

function asObjectOptions (
  options: ThrottlerModuleOptions
): Exclude<ThrottlerModuleOptions, unknown[]> {
  if (Array.isArray(options)) {
    throw new TypeError('Expected object throttler options')
  }

  return options
}
