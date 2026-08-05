import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  afterSeedListeners,
  notifyAfterSeed,
  registerAfterSeedListener,
} from '../src/listeners'
import type { SeedResult } from '../src/types'

const result: SeedResult = {
  collections: [
    'posts',
  ],
  created: {
    posts: 2,
  },
  deferred: [],
  globals: [
    'header',
  ],
  order: [],
  skipped: [],
}

describe('after-seed listeners', () => {
  beforeEach(() => {
    ;

    (globalThis as Record<symbol, unknown>)[Symbol.for('pro-laico.payload-seed.afterSeed')] = undefined
  })

  it('registers keyed listeners idempotently and invokes them with the result', async () => {
    const listener = vi.fn()

    registerAfterSeedListener('test', listener)
    registerAfterSeedListener('test', listener)
    expect(Object.keys(afterSeedListeners())).toEqual([
      'test',
    ])

    const payload = {
      logger: {
        warn: vi.fn(),
      },
    }

    await notifyAfterSeed(payload as never, {} as never, result)
    expect(listener).toHaveBeenCalledExactlyOnceWith(result, {
      payload,
      req: {},
    })
  })

  it('isolates listener failures: logs a warning, never throws', async () => {
    registerAfterSeedListener('boom', () => {
      throw new Error('nope')
    })

    const ok = vi.fn()

    registerAfterSeedListener('ok', ok)

    const warn = vi.fn()

    await expect(notifyAfterSeed({
      logger: {
        warn,
      },
    } as never, {} as never, result)).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('afterSeed listener \'boom\' failed: nope'))
    expect(ok).toHaveBeenCalledExactlyOnceWith()
  })
})
