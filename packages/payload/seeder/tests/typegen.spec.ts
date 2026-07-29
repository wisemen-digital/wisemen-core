import {
  describe,
  expect,
  it,
} from 'vitest'

import { defineSeed } from '../src/defineSeed'
import { buildSeedRegistry } from '../src/typegen'

describe('buildSeedRegistry', () => {
  const definitions = [
    defineSeed('services' as never, () => [
      {
        _key: 'consulting',
      },
      {
        _key: 'implementation',
      },
    ] as never),
    defineSeed('posts' as never, () => [
      {
        _key: 'launch',
      },
    ] as never),
    defineSeed('site-settings' as never, () => ({}) as never),
  ]

  it('augments SeedRegistry with sorted collection/global key unions', () => {
    const out = buildSeedRegistry(definitions, '@repo/payload-seed')

    expect(out).toContain('declare module \'@repo/payload-seed\'')
    expect(out).toContain('\'posts\': \'launch\'')
    expect(out).toContain('\'services\': \'consulting\' | \'implementation\'')
    expect(out).toContain('globals: \'site-settings\'')
    expect(out).not.toContain('assets')
    expect(out).not.toContain('SeedProviders')
  })

  it('emits `never` for empty globals', () => {
    const out = buildSeedRegistry([
      defineSeed('services' as never, () => [
        {
          _key: 'a',
        },
      ] as never),
    ])

    expect(out).toContain('globals: never')
  })
})
