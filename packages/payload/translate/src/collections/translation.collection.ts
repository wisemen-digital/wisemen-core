import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  Field,
} from 'payload'

import type { TranslationMode } from '#status.ts'
import {
  resolveTranslationStatusMap,
  TRANSLATION_STATUS_FIELD_NAME,
  TRANSLATION_STATUSES,
} from '#status.ts'

export function ensureTranslationStatusField(fields: Field[], collectionSlug: string): Field[] {
  if (fields.some((field) => 'name' in field && field.name === TRANSLATION_STATUS_FIELD_NAME)) {
    return fields
  }

  return [
    ...fields,
    {
      name: TRANSLATION_STATUS_FIELD_NAME,
      admin: {
        components: {
          Cell: '@repo/payload-translate/client#TranslationStatusCell',
          Field: '@repo/payload-translate/client#TranslationStatusField',
        },
        custom: {
          collectionSlug,
        },
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Translation status',
      localized: true,
      options: [
        {
          label: 'Not translated',
          value: TRANSLATION_STATUSES.notTranslated,
        },
        {
          label: 'Automatically translated',
          value: TRANSLATION_STATUSES.translated,
        },
        {
          label: 'Stale translation',
          value: TRANSLATION_STATUSES.staleTranslation,
        },
        {
          label: 'Manually edited',
          value: TRANSLATION_STATUSES.manuallyEdited,
        },
      ],
      type: 'select',
    },
  ]
}

export function ensureTranslationStatusColumn(defaultColumns: string[] | undefined): string[] {
  const columns = defaultColumns ?? []

  if (columns.includes(TRANSLATION_STATUS_FIELD_NAME)) {
    return columns
  }

  return [
    ...columns,
    TRANSLATION_STATUS_FIELD_NAME,
  ]
}

export function createTranslationStatusBeforeChangeHook(translatablePaths: string[][]): CollectionBeforeChangeHook {
  return ({
    data,
    originalDoc,
    req,
  }) => {
    if (!data || typeof data !== 'object') {
      return data
    }

    const translationContext = req.context?.payloadTranslate as {
      mode?: 'mark-stale' | TranslationMode
    } | undefined

    if (translationContext?.mode === 'mark-stale') {
      return data
    }

    if (!translationContext?.mode && !hasTranslatableFieldChange({
      data,
      originalDoc,
      translatablePaths,
    })) {
      return data
    }

    data[TRANSLATION_STATUS_FIELD_NAME] = translationContext?.mode
      ? TRANSLATION_STATUSES.translated
      : TRANSLATION_STATUSES.manuallyEdited

    return data
  }
}

export function createTranslationStatusAfterChangeHook({
  collectionSlug,
  defaultLocale,
  locales,
}: {
  collectionSlug: string
  defaultLocale: string | undefined
  locales: string[]
}): CollectionAfterChangeHook {
  return async ({
    doc,
    operation,
    req,
  }) => {
    if (!defaultLocale || operation !== 'update' || req.locale !== defaultLocale || !doc?.id) {
      return doc
    }

    const translationContext = req.context?.payloadTranslate as {
      mode?: 'mark-stale' | TranslationMode
    } | undefined

    if (translationContext?.mode) {
      return doc
    }

    const allLocalesDocument = await req.payload.findByID({
      id: doc.id,
      collection: collectionSlug as never,
      depth: 0,
      draft: true,
      locale: 'all' as never,
      overrideAccess: true,
      req,
    })
    const statuses = resolveTranslationStatusMap(
      allLocalesDocument?.[TRANSLATION_STATUS_FIELD_NAME],
      locales,
    )
    const staleLocales = locales.filter(
      (locale) => locale !== defaultLocale && statuses[locale] === TRANSLATION_STATUSES.translated,
    )

    if (staleLocales.length === 0) {
      return doc
    }

    const previousContext = req.context

    req.context = {
      ...previousContext,
      payloadTranslate: {
        mode: 'mark-stale',
      },
    }

    try {
      for (const locale of staleLocales) {
        await req.payload.update({
          id: doc.id,
          collection: collectionSlug as never,
          data: {
            [TRANSLATION_STATUS_FIELD_NAME]: TRANSLATION_STATUSES.staleTranslation,
          } as never,
          depth: 0,
          draft: true,
          locale: locale as never,
          overrideAccess: true,
          req,
        })
      }
    }
    finally {
      req.context = previousContext
    }

    return doc
  }
}

function hasTranslatableFieldChange({
  data,
  originalDoc,
  translatablePaths,
}: {
  data: Record<string, unknown>
  originalDoc: unknown
  translatablePaths: string[][]
}): boolean {
  return translatablePaths.some((path) => {
    const nextValueResult = getValueAtPath(data, path)

    if (!nextValueResult.found) {
      return false
    }

    const previousValueResult = getValueAtPath(originalDoc, path)

    return !areValuesEqual(nextValueResult.value, previousValueResult.value)
  })
}

function getValueAtPath(value: unknown, path: string[]): {
  found: boolean
  value: unknown
} {
  let currentValue = value

  for (const segment of path) {
    if (!currentValue || typeof currentValue !== 'object' || !(segment in currentValue)) {
      return {
        found: false,
        value: undefined,
      }
    }

    currentValue = (currentValue as Record<string, unknown>)[segment]
  }

  return {
    found: true,
    value: currentValue,
  }
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}
