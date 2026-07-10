/* eslint-disable no-nested-ternary */
import type {
  Field,
  PayloadRequest,
} from 'payload'

import { extractTranslationAdapterSettings } from '#settings/translation.settings.ts'
import {
  isTranslationMode,
  resolveTranslationStatusMap,
  TRANSLATION_MODES,
  TRANSLATION_STATUSES,
} from '#status.ts'
import {
  resolveFieldSelections,
  translateDocumentFields,
} from '#translation.engine.ts'
import type {
  TranslatableCollectionDefinition,
  TranslationAccess,
  TranslationAdapter,
  TranslationAdapterDefinition,
  TranslationPluginOptions,
} from '#types.ts'
import {
  canAccessTranslation,
  isPlainObject,
} from '#utils/index.ts'

export function createTranslationEndpointHandler({
  access,
  adapterDefinitions,
  collections,
  config,
  richText,
  translations,
}: {
  access?: TranslationAccess
  adapterDefinitions: readonly TranslationAdapterDefinition[]
  collections: ReadonlyMap<string, TranslatableCollectionDefinition<Record<string, unknown>, string>>
  config: {
    collections?: Array<{ fields?: Field[]
      slug: string }>
    localization?: false | { defaultLocale?: string
      locales?: Array<string | { code: string }> }
  }
  richText: TranslationPluginOptions['richText']
  translations: NonNullable<TranslationPluginOptions['translations']> | undefined
}) {
  return async function handler(req: PayloadRequest): Promise<Response> {
    if (req.method !== 'POST') {
      return Response.json({
        error: 'Method not allowed.',
      }, {
        status: 405,
      })
    }

    if (!req.user) {
      return Response.json({
        error: 'Unauthorized.',
      }, {
        status: 401,
      })
    }

    const collectionSlug = req.routeParams?.collection as string | undefined
    const definition = collectionSlug ? collections.get(collectionSlug) : undefined
    const payloadCollection = config.collections?.find((collection) => collection.slug === collectionSlug)

    if (!definition || !collectionSlug || !payloadCollection) {
      return Response.json({
        error: 'Collection is not configured for translation.',
      }, {
        status: 404,
      })
    }

    const body = await req.json?.() as {
      adapterKey?: string
      documentID?: number | string
      mode?: string
      sourceLocale?: string
      targetLocale?: string
      targetLocales?: string[]
    }

    if (!body?.documentID) {
      return Response.json({
        error: 'documentID is required.',
      }, {
        status: 400,
      })
    }

    const localization = config.localization && typeof config.localization === 'object'
      ? config.localization as {
        defaultLocale?: string
        locales?: Array<string | { code: string }>
      }
      : undefined
    const defaultLocale = localization?.defaultLocale
    const sourceLocale = body.sourceLocale ?? req.locale ?? defaultLocale

    if (!sourceLocale) {
      return Response.json({
        error: 'Unable to resolve source locale.',
      }, {
        status: 400,
      })
    }

    const configuredLocales = localization?.locales?.map((locale) => typeof locale === 'string' ? locale : locale.code) ?? []

    const requestedTargetLocales = body.targetLocales?.length
      ? body.targetLocales
      : (body.targetLocale
          ? [
              body.targetLocale,
            ]
          : [])

    if (requestedTargetLocales.length === 0) {
      return Response.json({
        error: 'targetLocale or targetLocales is required.',
      }, {
        status: 400,
      })
    }

    const ALL_LOCALES_TARGET = 'all'
    const resolvedTargetLocales = requestedTargetLocales.includes(ALL_LOCALES_TARGET)
      ? configuredLocales.filter((locale) => locale !== sourceLocale)
      : requestedTargetLocales

    const uniqueTargetLocales = Array.from(new Set(resolvedTargetLocales))
    const invalidTargetLocales = uniqueTargetLocales.filter((locale) => !configuredLocales.includes(locale))

    if (invalidTargetLocales.length > 0) {
      return Response.json({
        error: `Unknown target locale${invalidTargetLocales.length > 1 ? 's' : ''}: ${invalidTargetLocales.join(', ')}.`,
      }, {
        status: 400,
      })
    }

    if (uniqueTargetLocales.includes(sourceLocale)) {
      return Response.json({
        error: 'Source and target locale cannot be the same.',
      }, {
        status: 400,
      })
    }

    if (uniqueTargetLocales.length === 0) {
      return Response.json({
        error: 'No target locales available for translation.',
      }, {
        status: 400,
      })
    }

    const selectedAdapterKey = typeof body.adapterKey === 'string' && body.adapterKey.length > 0
      ? body.adapterKey
      : undefined

    if (selectedAdapterKey && !adapterDefinitions.some((definition) => definition.key === selectedAdapterKey)) {
      return Response.json({
        error: `Unknown translation adapter: ${selectedAdapterKey}.`,
      }, {
        status: 400,
      })
    }

    const sourceDocument = await req.payload.findByID({
      id: body.documentID,
      collection: collectionSlug,
      depth: 0,
      draft: true,
      locale: sourceLocale,
      overrideAccess: false,
      req,
    })

    if (!sourceDocument || typeof sourceDocument !== 'object') {
      return Response.json({
        error: 'Source document could not be loaded.',
      }, {
        status: 404,
      })
    }

    if (!(await canAccessTranslation(access, {
      collectionSlug,
      document: sourceDocument,
      req,
      translations,
    }))) {
      return Response.json({
        error: 'Forbidden.',
      }, {
        status: 403,
      })
    }

    const translationAdapters = await resolveTranslationAdapters({
      adapterDefinitions,
      req,
      selectedAdapterKey,
      translations,
    })

    const resolvedSelections = resolveFieldSelections(payloadCollection.fields ?? [], definition.translatableFields)
    const translationMode = isTranslationMode(body.mode) ? body.mode : TRANSLATION_MODES.translate
    const documentWithAllLocales = await req.payload.findByID({
      id: body.documentID,
      collection: collectionSlug,
      depth: 0,
      draft: true,
      locale: 'all',
      overrideAccess: false,
      req,
    })
    const translationStatuses = resolveTranslationStatusMap(
      documentWithAllLocales?.translationStatus,
      configuredLocales,
    )
    const eligibleTargetLocales = resolvedTargetLocales.length === 0
      ? []
      : (translationMode === TRANSLATION_MODES.retranslate
          ? uniqueTargetLocales
          : uniqueTargetLocales.filter((locale) => translationStatuses[locale] !== TRANSLATION_STATUSES.translated))

    if (eligibleTargetLocales.length === 0) {
      return Response.json({
        ok: true,
        skippedLocales: uniqueTargetLocales,
        translatedLocales: [],
      })
    }

    for (const targetLocale of eligibleTargetLocales) {
      const translatedData = await translateWithFallbackAdapters({
        adapters: translationAdapters,
        req,
        richText,
        selections: resolvedSelections,
        sourceDocument,
        sourceLocale,
        targetLocale,
      })

      const previousContext = req.context

      req.context = {
        ...previousContext,
        payloadTranslate: {
          mode: translationMode,
        },
      }

      try {
        await req.payload.update({
          id: body.documentID,
          collection: collectionSlug,
          data: translatedData,
          depth: 0,
          draft: true,
          locale: targetLocale,
          overrideAccess: false,
          req,
        })
      }
      finally {
        req.context = previousContext
      }
    }

    return Response.json({
      ok: true,
      skippedLocales: uniqueTargetLocales.filter((locale) => !eligibleTargetLocales.includes(locale)),
      translatedLocales: eligibleTargetLocales,
    })
  }
}

async function resolveTranslationAdapters({
  adapterDefinitions,
  req,
  selectedAdapterKey,
  translations,
}: {
  adapterDefinitions: readonly TranslationAdapterDefinition[]
  req: PayloadRequest
  selectedAdapterKey?: string
  translations: NonNullable<TranslationPluginOptions['translations']> | undefined
}): Promise<TranslationAdapter[]> {
  if (adapterDefinitions.length === 0) {
    return []
  }

  if (!translations) {
    return adapterDefinitions.map((definition) => definition.create(definition.defaultOptions ?? {}))
  }

  const translationSettingsDoc = await resolveTranslationSettingsDocument({
    req,
    translations,
  })
  const adapterSettings = extractTranslationAdapterSettings(translationSettingsDoc)

  if (selectedAdapterKey) {
    const selectedDefinition = adapterDefinitions.find((definition) => definition.key === selectedAdapterKey)

    return [
      createTranslationAdapterFromDefinition({
        adapterSettings,
        definition: selectedDefinition as TranslationAdapterDefinition,
      }),
    ]
  }

  return adapterDefinitions.map((definition) => {
    return createTranslationAdapterFromDefinition({
      adapterSettings,
      definition,
    })
  })
}

function createTranslationAdapterFromDefinition({
  adapterSettings, definition,
}: {
  adapterSettings?: Record<string, unknown>
  definition: TranslationAdapterDefinition
}): TranslationAdapter {
  const rawOptions = adapterSettings?.[definition.key]
  const options = isPlainObject(rawOptions)
    ? mergeAdapterOptions(definition.defaultOptions ?? {}, rawOptions)
    : definition.defaultOptions ?? {}

  return definition.create(options)
}

function mergeAdapterOptions(
  defaultOptions: Record<string, unknown>,
  rawOptions: Record<string, unknown>,
): Record<string, unknown> {
  const merged = {
    ...defaultOptions,
  }

  for (const [
    key,
    value,
  ] of Object.entries(rawOptions)) {
    if (value === null || value === undefined) {
      continue
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      continue
    }

    merged[key] = value
  }

  return merged
}

async function translateWithFallbackAdapters({
  adapters,
  req,
  richText,
  selections,
  sourceDocument,
  sourceLocale,
  targetLocale,
}: {
  adapters: TranslationAdapter[]
  req: PayloadRequest
  richText: TranslationPluginOptions['richText']
  selections: ReturnType<typeof resolveFieldSelections>
  sourceDocument: Record<string, unknown>
  sourceLocale: string
  targetLocale: string
}): Promise<Record<string, unknown>> {
  let lastError: unknown

  for (const adapter of adapters) {
    try {
      return await translateDocumentFields({
        adapter,
        req,
        richText,
        selections,
        sourceDocument,
        sourceLocale,
        targetLocale,
      })
    }
    catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('No translation adapters are available.')
}

async function resolveTranslationSettingsDocument({
  req, translations,
}: {
  req: PayloadRequest
  translations: NonNullable<TranslationPluginOptions['translations']>
}): Promise<Record<string, unknown> | undefined> {
  if (translations.type === 'global') {
    return req.payload.findGlobal({
      depth: 0,
      draft: true,
      locale: req.locale,
      overrideAccess: false,
      req,
      slug: translations.slug,
    })
  }

  if (translations.documentID) {
    return req.payload.findByID({
      id: translations.documentID,
      collection: translations.slug,
      depth: 0,
      draft: true,
      locale: req.locale,
      overrideAccess: false,
      req,
    })
  }

  const result = await req.payload.find({
    collection: translations.slug,
    depth: 0,
    limit: 1,
    locale: req.locale,
    overrideAccess: false,
    pagination: false,
    req,
  })

  return result.docs[0]
}
