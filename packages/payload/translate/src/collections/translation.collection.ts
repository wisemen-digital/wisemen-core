import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  Field,
} from 'payload'

import { t } from '#i18n/index.ts'
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
          Cell: '@wisemen/payload-core-translate/client#TranslationStatusCell',
          Field: '@wisemen/payload-core-translate/client#TranslationStatusField',
        },
        custom: {
          collectionSlug,
        },
        position: 'sidebar',
        readOnly: true,
      },
      label: t('general.translation_status'),
      localized: true,
      options: [
        {
          label: t('general.not_translated'),
          value: TRANSLATION_STATUSES.notTranslated,
        },
        {
          label: t('general.automatically_translated'),
          value: TRANSLATION_STATUSES.translated,
        },
        {
          label: t('general.stale_translation'),
          value: TRANSLATION_STATUSES.staleTranslation,
        },
        {
          label: t('general.manually_edited'),
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

export function createTranslationStatusBeforeChangeHook(
  translatablePaths: string[][],
  ignoredPaths: string[][] = [],
): CollectionBeforeChangeHook {
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
      ignoredPaths,
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
  ignoredPaths = [],
  locales,
  translatablePaths,
}: {
  collectionSlug: string
  defaultLocale: string | undefined
  ignoredPaths?: string[][]
  locales: string[]
  translatablePaths: string[][]
}): CollectionAfterChangeHook {
  return async ({
    doc,
    operation,
    previousDoc,
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

    if (!hasTranslatableFieldChange({
      data: doc,
      ignoredPaths,
      originalDoc: previousDoc,
      translatablePaths,
    })) {
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
  ignoredPaths,
  originalDoc,
  translatablePaths,
}: {
  data: Record<string, unknown>
  ignoredPaths: string[][]
  originalDoc: unknown
  translatablePaths: string[][]
}): boolean {
  return translatablePaths.some((path) => {
    if (isIgnoredPath(path, ignoredPaths)) {
      return false
    }

    const nextValueResult = getValueAtPath(data, path)

    if (!nextValueResult.found) {
      return false
    }

    const previousValueResult = getValueAtPath(originalDoc, path)

    return !areValuesEqual(nextValueResult.value, previousValueResult.value)
  })
}

function isIgnoredPath(path: string[], ignoredPaths: string[][]): boolean {
  return ignoredPaths.some((ignoredPath) => arePathsEqual(path, ignoredPath))
}

function arePathsEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((segment, index) => segment === right[index])
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
  return JSON.stringify(normalizeComparableValue(left)) === JSON.stringify(normalizeComparableValue(right))
}

function normalizeComparableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeComparableValue(item))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const normalized = {
    ...value,
  } as Record<string, unknown>

  delete normalized.id
  delete normalized.blockName

  const sortedEntries = Object.entries(normalized).sort(([
    leftKey,
  ], [
    rightKey,
  ]) => leftKey.localeCompare(rightKey))

  for (const [
    key,
    childValue,
  ] of sortedEntries) {
    if (Array.isArray(childValue) || (childValue && typeof childValue === 'object')) {
      normalized[key] = normalizeComparableValue(childValue)
    }
  }

  return Object.fromEntries(sortedEntries.map(([
    key,
  ]) => [
    key,
    normalized[key],
  ]))
}
