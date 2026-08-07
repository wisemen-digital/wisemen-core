import {
  describe,
  expect,
  it,
} from 'vitest'

import { buildGraph } from '#engine/graph'
import { ref } from '#refs'
import type { BuiltModel } from '#types'

function model(over: Partial<BuiltModel> = {}): BuiltModel {
  return {
    collections: [],
    globals: [],
    ...over,
  }
}

describe('buildGraph', () => {
  it('orders dependencies before dependents (topological)', () => {
    const graph = buildGraph(
      model({
        collections: [
          {
            records: [
              {
                data: {
                  service: ref('services', 'consulting'),
                },
                key: 'launch',
              },
            ],
            slug: 'posts',
          },
          {
            records: [
              {
                data: {},
                key: 'consulting',
              },
            ],
            slug: 'services',
          },
        ],
      }),
    )

    // services:consulting must come before posts:launch regardless of declaration order
    expect(graph.order.indexOf('services:consulting')).toBeLessThan(graph.order.indexOf('posts:launch'))
  })

  it('captures ref edges, including from globals', () => {
    const graph = buildGraph(
      model({
        collections: [
          {
            records: [
              {
                data: {},
                key: 'a',
              },
            ],
            slug: 'services',
          },
          {
            records: [
              {
                data: {
                  service: ref('services', 'a'),
                },
                key: 'p',
              },
            ],
            slug: 'posts',
          },
        ],
        globals: [
          {
            data: {
              featured: ref('services', 'a'),
            },
            slug: 'site',
          },
        ],
      }),
    )

    expect(graph.edges).toContainEqual({
      from: 'posts:p',
      to: 'services:a',
    })
    expect(graph.edges).toContainEqual({
      from: 'global:site',
      to: 'services:a',
    })
    // globals are not part of the doc create order (they're updated after all docs)
    expect(graph.order).not.toContain('global:site')
  })

  it('throws on a dependency cycle, naming the cycle', () => {
    expect(() =>
      buildGraph(
        model({
          collections: [
            {
              records: [
                {
                  data: {
                    r: ref('b', 'y'),
                  },
                  key: 'x',
                },
              ],
              slug: 'a',
            },
            {
              records: [
                {
                  data: {
                    r: ref('a', 'x'),
                  },
                  key: 'y',
                },
              ],
              slug: 'b',
            },
          ],
        }),
      )).toThrow(/cycle detected/i)
  })

  it('handles a doc with no dependencies', () => {
    const graph = buildGraph(model({
      collections: [
        {
          records: [
            {
              data: {
                title: 'hi',
              },
              key: 'x',
            },
          ],
          slug: 'a',
        },
      ],
    }))

    expect(graph.order).toEqual([
      'a:x',
    ])
    expect(graph.edges).toHaveLength(0)
  })

  it('breaks a cycle by deferring an optional field (both docs still ordered)', () => {
    const graph = buildGraph(
      model({
        collections: [
          {
            records: [
              {
                data: {
                  r: ref('b', 'y'),
                },
                key: 'x',
              },
            ],
            slug: 'a',
          },
          {
            records: [
              {
                data: {
                  r: ref('a', 'x'),
                },
                key: 'y',
              },
            ],
            slug: 'b',
          },
        ],
      }),
      {
        isRequired: () => false,
      },
    )

    expect(graph.order).toEqual(expect.arrayContaining([
      'a:x',
      'b:y',
    ]))
    expect(graph.order).toHaveLength(2)
    expect(graph.deferred).toHaveLength(1)
    expect([
      'a:x',
      'b:y',
    ]).toContain(graph.deferred[0]?.node)
    expect(graph.deferred[0]?.field).toBe('r')
  })

  it('breaks the cycle at the optional edge, not the required one', () => {
    // a.b is required (b must exist before a); b.a is optional, so it's the one deferred.
    const graph = buildGraph(
      model({
        collections: [
          {
            records: [
              {
                data: {
                  b: ref('b', 'y'),
                },
                key: 'x',
              },
            ],
            slug: 'a',
          },
          {
            records: [
              {
                data: {
                  a: ref('a', 'x'),
                },
                key: 'y',
              },
            ],
            slug: 'b',
          },
        ],
      }),
      {
        isRequired: (collection, field) => collection === 'a' && field === 'b',
      },
    )

    expect(graph.order.indexOf('b:y')).toBeLessThan(graph.order.indexOf('a:x'))
    expect(graph.deferred).toEqual([
      {
        field: 'a',
        node: 'b:y',
      },
    ])
  })

  it('defers a self-reference', () => {
    const graph = buildGraph(model({
      collections: [
        {
          records: [
            {
              data: {
                self: ref('a', 'x'),
              },
              key: 'x',
            },
          ],
          slug: 'a',
        },
      ],
    }), {
      isRequired: () => false,
    })

    expect(graph.order).toEqual([
      'a:x',
    ])
    expect(graph.deferred).toEqual([
      {
        field: 'self',
        node: 'a:x',
      },
    ])
  })

  it('still throws when every field in the cycle is required', () => {
    expect(() =>
      buildGraph(
        model({
          collections: [
            {
              records: [
                {
                  data: {
                    r: ref('b', 'y'),
                  },
                  key: 'x',
                },
              ],
              slug: 'a',
            },
            {
              records: [
                {
                  data: {
                    r: ref('a', 'x'),
                  },
                  key: 'y',
                },
              ],
              slug: 'b',
            },
          ],
        }),
        {
          isRequired: () => true,
        },
      )).toThrow(/cycle detected/i)
  })
})
