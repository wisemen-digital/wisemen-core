import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { TRANSLATION_STATUSES } from '#status.ts'

import {
  createTranslationStatusAfterChangeHook,
  createTranslationStatusBeforeChangeHook,
} from './translation.collection.ts'

describe('translation status hooks', () => {
  it('does not mark ignored fields as manually edited', () => {
    const hook = createTranslationStatusBeforeChangeHook(
      [
        [
          'title',
        ],
        [
          'seo',
          'slug',
        ],
      ],
      [
        [
          'seo',
          'slug',
        ],
      ],
    )

    const data = {
      seo: {
        slug: 'updated',
      },
    }

    const result = hook({
      data,
      originalDoc: {
        seo: {
          slug: 'old',
        },
      },
      req: {
        context: {},
      },
    } as never)

    expect(result).toBe(data)
    expect(result).not.toHaveProperty('translationStatus')
  })

  it('marks translated fields as manually edited', () => {
    const hook = createTranslationStatusBeforeChangeHook(
      [
        [
          'title',
        ],
        [
          'seo',
          'slug',
        ],
      ],
      [
        [
          'seo',
          'slug',
        ],
      ],
    )

    const data = {
      title: 'updated',
    }

    const result = hook({
      data,
      originalDoc: {
        title: 'old',
      },
      req: {
        context: {},
      },
    } as never)

    expect(result).toBe(data)
    expect(result).toHaveProperty('translationStatus', TRANSLATION_STATUSES.manuallyEdited)
  })

  it('does not mark block metadata-only changes as manually edited', () => {
    const hook = createTranslationStatusBeforeChangeHook([
      [
        'content',
      ],
    ])

    const data = {
      content: [
        {
          id: 'new-row-id',
          title: 'Hello',
          blockName: 'Hero published',
          blockType: 'hero',
          body: 'World',
        },
      ],
    }

    const result = hook({
      data,
      originalDoc: {
        content: [
          {
            id: 'old-row-id',
            title: 'Hello',
            blockName: 'Hero draft',
            blockType: 'hero',
            body: 'World',
          },
        ],
      },
      req: {
        context: {},
      },
    } as never)

    expect(result).toBe(data)
    expect(result).not.toHaveProperty('translationStatus')
  })

  it('does not mark sibling locales stale when only ignored fields changed', async () => {
    const update = vi.fn()
    const findByID = vi.fn().mockResolvedValue({
      translationStatus: {
        en: TRANSLATION_STATUSES.translated,
        fr: TRANSLATION_STATUSES.translated,
      },
    })

    const hook = createTranslationStatusAfterChangeHook({
      collectionSlug: 'articles',
      defaultLocale: 'en',
      ignoredPaths: [
        [
          'seo',
          'slug',
        ],
      ],
      locales: [
        'en',
        'fr',
      ],
      translatablePaths: [
        [
          'title',
        ],
        [
          'seo',
          'slug',
        ],
      ],
    })

    await hook({
      doc: {
        id: '1',
        seo: {
          slug: 'updated',
        },
      },
      operation: 'update',
      previousDoc: {
        id: '1',
        seo: {
          slug: 'old',
        },
      },
      req: {
        context: {},
        locale: 'en',
        payload: {
          findByID,
          update,
        },
      },
    } as never)

    expect(findByID).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()
  })

  it('marks sibling locales stale when a translatable field changes', async () => {
    const update = vi.fn().mockImplementation(async () => {})
    const findByID = vi.fn().mockResolvedValue({
      translationStatus: {
        en: TRANSLATION_STATUSES.translated,
        fr: TRANSLATION_STATUSES.translated,
      },
    })

    const hook = createTranslationStatusAfterChangeHook({
      collectionSlug: 'articles',
      defaultLocale: 'en',
      ignoredPaths: [
        [
          'seo',
          'slug',
        ],
      ],
      locales: [
        'en',
        'fr',
      ],
      translatablePaths: [
        [
          'title',
        ],
        [
          'seo',
          'slug',
        ],
      ],
    })

    await hook({
      doc: {
        id: '1',
        title: 'updated',
      },
      operation: 'update',
      previousDoc: {
        id: '1',
        title: 'old',
      },
      req: {
        context: {},
        locale: 'en',
        payload: {
          findByID,
          update,
        },
      },
    } as never)

    expect(findByID).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledTimes(1)
  })
})
