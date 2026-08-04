/* eslint-disable test/no-conditional-expect */
import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  SeedValidationError,
  validateModel,
} from '#engine/validate'
import {
  file,
  ref,
} from '#refs'
import type { BuiltModel } from '#types'

const slugs = new Set([
  'services',
  'posts',
  'media',
])
const globalSlugs = new Set([
  'site-settings',
])
const fileCollections = new Set([
  'media',
])

function run(model: BuiltModel) {
  return validateModel({
    collectionSlugs: slugs,
    fileCollections,
    globalSlugs,
    model,
  })
}

describe('validateModel', () => {
  it('passes when every ref resolves', () => {
    expect(() =>
      run({
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
        globals: [],
      })).not.toThrowError()
  })

  it('flags a ref to a non-existent _key (dangling reference)', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {
                  service: ref('services', 'ghost'),
                },
                key: 'p',
              },
            ],
            slug: 'posts',
          },
        ],
        globals: [],
      })).toThrowError(/no seeded 'services' doc has _key 'ghost'/)
  })

  it('flags a ref to an unknown collection', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {
                  x: ref('widgets' as never, 'a'),
                },
                key: 'p',
              },
            ],
            slug: 'posts',
          },
        ],
        globals: [],
      })).toThrowError(/unknown collection 'widgets'/)
  })

  it('allows a _file on an upload/asset collection', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {
                  alt: 'Hero',
                },
                file: file('hero.jpg'),
                key: 'hero',
              },
            ],
            slug: 'media',
          },
        ],
        globals: [],
      })).not.toThrowError()
  })

  it('flags a _file on a collection that is neither upload nor a custom.seedAsset collection', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {},
                file: file('x.jpg'),
                key: 'a',
              },
            ],
            slug: 'services',
          },
        ],
        globals: [],
      })).toThrowError(/not an upload collection or a custom\.seedAsset collection/)
  })

  it('flags a definition whose own collection slug is not in the config', () => {
    expect(() => run({
      collections: [
        {
          records: [
            {
              data: {},
              key: 'a',
            },
          ],
          slug: 'widgets',
        },
      ],
      globals: [],
    })).toThrowError(
      /defineSeed\('widgets'\): no collection 'widgets' in the Payload config/,
    )
  })

  it('flags a definition whose own global slug is not in the config', () => {
    expect(() => run({
      collections: [],
      globals: [
        {
          data: {},
          slug: 'footer',
        },
      ],
    })).toThrowError(
      /defineSeed\('footer'\): no global 'footer' in the Payload config/,
    )
  })

  it('flags duplicate _keys across two definitions of the same slug', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {},
                key: 'dup',
              },
            ],
            slug: 'media',
          },
          {
            records: [
              {
                data: {},
                key: 'dup',
              },
            ],
            slug: 'media',
          },
        ],
        globals: [],
      })).toThrowError(/media: duplicate _key 'dup'/)
  })

  it('flags duplicate _keys within a collection', () => {
    expect(() =>
      run({
        collections: [
          {
            records: [
              {
                data: {},
                key: 'dup',
              },
              {
                data: {},
                key: 'dup',
              },
            ],
            slug: 'services',
          },
        ],
        globals: [],
      })).toThrowError(/duplicate _key 'dup'/)
  })

  it('flags unknown record fields when fieldNames is supplied', () => {
    const fieldNames = new Map([
      [
        'services',
        new Set([
          'title',
          'slug',
        ]),
      ],
    ])

    expect(() =>
      validateModel({
        collectionSlugs: slugs,
        fieldNames,
        fileCollections,
        globalSlugs,
        model: {
          collections: [
            {
              records: [
                {
                  data: {
                    title: 'X',
                    bogus: 'Y',
                  },
                  key: 'a',
                },
              ],
              slug: 'services',
            },
          ],
          globals: [],
        },
      })).toThrowError(/unknown field 'bogus'/)
  })

  it('allows `_status` and known fields; skips the check without fieldNames', () => {
    const model: BuiltModel = {
      collections: [
        {
          records: [
            {
              data: {
                title: 'X',
                _status: 'draft',
              },
              key: 'a',
            },
          ],
          slug: 'services',
        },
      ],
      globals: [],
    }

    expect(() =>
      validateModel({
        collectionSlugs: slugs,
        fieldNames: new Map([
          [
            'services',
            new Set([
              'title',
            ]),
          ],
        ]),
        fileCollections,
        globalSlugs,
        model,
      })).not.toThrowError()
    expect(() => run(model)).not.toThrowError() // no fieldNames → field check skipped
  })

  it('aggregates multiple issues into one SeedValidationError', () => {
    try {
      run({
        collections: [
          {
            records: [
              {
                data: {
                  a: ref('services', 'ghost'),
                },
                file: file('x.jpg'),
                key: 'p',
              },
            ],
            slug: 'posts',
          },
        ],
        globals: [],
      })
      expect.unreachable('should have thrown')
    }
    catch (error) {
      expect(error).toBeInstanceOf(SeedValidationError)
      // a dangling ref + a _file on a non-file collection
      expect((error as SeedValidationError).issues).toHaveLength(2)
    }
  })
})
