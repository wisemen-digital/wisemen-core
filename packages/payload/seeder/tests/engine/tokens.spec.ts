import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  collectTokens,
  docNodeId,
  resolveTokens,
} from '#engine/tokens'
import {
  file,
  ref,
} from '#refs'

describe('collectTokens', () => {
  it('finds ref tokens nested in objects and arrays (files are not edge tokens)', () => {
    const data = {
      title: 'plain',
      _file: file('hero.jpg'),
      related: [
        ref('services', 'a'),
        {
          nested: ref('services', 'b'),
        },
      ],
    }
    const tokens = collectTokens(data)

    expect(tokens).toHaveLength(2)
    expect(tokens.every((t) => t.__seedRef === 'doc')).toBeTruthy()
  })

  it('returns nothing for token-free data', () => {
    expect(collectTokens({
      a: 1,
      b: [
        'x',
        {
          c: true,
        },
      ],
    })).toEqual([])
  })
})

describe('resolveTokens', () => {
  const ctx = {
    docs: new Map<string, number | string>([
      [
        docNodeId('services', 'a'),
        42,
      ],
    ]),
    where: 'test',
  }

  it('replaces ref tokens with resolved ids, preserving structure', () => {
    const out = resolveTokens({
      arr: [
        ref('services', 'a'),
      ],
      keep: 'x',
      rel: ref('services', 'a'),
    }, ctx)

    expect(out).toEqual({
      arr: [
        42,
      ],
      keep: 'x',
      rel: 42,
    })
  })

  it('passes file tokens through untouched (they are delivered separately)', () => {
    const token = file('intro.mp4', {
      weight: '400',
    })

    expect(resolveTokens({
      _file: token,
    }, ctx)).toEqual({
      _file: token,
    })
  })

  it('throws a contextual error for an unresolved ref', () => {
    expect(() => resolveTokens({
      r: ref('services', 'missing'),
    }, ctx)).toThrowError(/unresolved ref\('services', 'missing'\)/)
  })
})
