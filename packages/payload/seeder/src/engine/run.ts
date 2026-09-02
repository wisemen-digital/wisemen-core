/* eslint-disable max-depth */
/* eslint-disable no-nested-ternary */
import type {
  Payload,
  PayloadRequest,
} from 'payload'
import { createLocalReq } from 'payload'

import { isRecord } from '#_kit'
import { notifyAfterSeed } from '#listeners'
import { resolveOptions } from '#options'
import {
  file,
  isFileToken,
  isRef,
  ref,
} from '#refs'
import type {
  AssetCollection,
  BuiltCollection,
  BuiltGlobal,
  BuiltModel,
  BuiltRecord,
  ResolvedSeedOptions,
  RunSeedArgs,
  SeedDefinition,
  SeedPluginOptions,
  SeedResult,
  SkippedDefinition,
} from '#types'

import {
  readFileAsUpload,
  resolveFilePath,
  searchedDirs,
} from './files'
import { buildGraph } from './graph'
import {
  collectTokens,
  docNodeId,
  resolveTokens,
} from './tokens'
import {
  SeedRunError,
  SeedValidationError,
  validateModel,
} from './validate'

function deepestReason(err: unknown, fallback?: string): string {
  let deepest = err instanceof Error ? err : undefined

  while (deepest?.cause instanceof Error) {
    deepest = deepest.cause
  }
  let msg = deepest?.message ?? fallback ?? String(err)
  const data = isRecord(deepest) && isRecord(deepest.data) ? deepest.data : undefined
  const errors = data && Array.isArray(data.errors) ? data.errors : undefined

  if (errors?.length) {
    const fields = errors
      .map((e) => {
        const r = isRecord(e) ? e : {}
        const path = typeof r.path === 'string' ? r.path : (typeof r.field === 'string' ? r.field : '?')

        return `${path}: ${typeof r.message === 'string' ? r.message : '?'}`
      })
      .join('; ')

    msg = `${msg} — ${fields}`
  }

  return msg.replace(/\s+/g, ' ').slice(0, 300)
}

async function describeFailedDoc(
  payload: Payload,
  req: PayloadRequest,
  slug: string,
  useAsTitle: string | undefined,
  id: number | string,
): Promise<string> {
  try {
    const doc = await payload.findByID({
      id,
      collection: slug,
      depth: 0,
      req,
    })
    const label = [
      useAsTitle ? doc[useAsTitle] : undefined,
      doc.title,
      doc.name,
      doc.slug,
      doc.filename,
    ].find(
      (v): v is string => typeof v === 'string' && v.trim().length > 0,
    )

    if (label) {
      return `"${label}" [${id}]`
    }
  }
  catch {}

  return `[${id}]`
}

const tokens = {
  file,
  ref,
}

function getSeedLocales(payload: Payload, options: ResolvedSeedOptions): string[] {
  const localization = payload.config.localization
  const configuredLocales = options.options.locales ?? (localization ? localization.localeCodes : [])

  return [
    ...new Set(configuredLocales.filter((locale): locale is string => typeof locale === 'string')),
  ]
}

/**
 * Turns `{ en: 'Hello', nl: 'Hallo' }` values into the value for one locale.
 * Locale maps can appear at any depth, so localized fields inside groups,
 * blocks, and globals work the same way as top-level fields.
 */
function selectLocaleValue(value: unknown, locale: string, defaultLocale: string, locales: Set<string>): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => selectLocaleValue(item, locale, defaultLocale, locales))
  }
  if (!isRecord(value)) {
    return value
  }

  const keys = Object.keys(value)
  const isLocaleMap = keys.length > 0 && keys.every((key) => locales.has(key))

  if (isLocaleMap) {
    return value[locale] ?? value[defaultLocale]
  }

  return Object.fromEntries(
    Object.entries(value).map(([
      key,
      entry,
    ]) => [
      key,
      selectLocaleValue(entry, locale, defaultLocale, locales),
    ]),
  )
}

function preserveNestedIds(value: unknown, existing: unknown): unknown {
  if (Array.isArray(value)) {
    const existingItems = Array.isArray(existing) ? existing : []

    return value.map((item, index) => preserveNestedIds(item, existingItems[index]))
  }
  if (!isRecord(value)) {
    return value
  }

  const existingRecord = isRecord(existing) ? existing : undefined
  const result: Record<string, unknown> = {
    ...value,
  }

  if (existingRecord?.id !== undefined && result.id === undefined) {
    result.id = existingRecord.id
  }

  for (const [
    key,
    entry,
  ] of Object.entries(value)) {
    if (Array.isArray(entry) || isRecord(entry)) {
      result[key] = preserveNestedIds(entry, existingRecord?.[key])
    }
  }

  return result
}

function discoverAssetCollections(payload: Payload): Map<string, AssetCollection> {
  const map = new Map<string, AssetCollection>()

  for (const slug of Object.keys(payload.collections)) {
    const raw = payload.collections[slug]?.config.custom?.seedAsset

    if (raw !== true && !isRecord(raw)) {
      continue
    }
    const sourceField = raw !== true && typeof raw.sourceField === 'string' ? raw.sourceField : 'source'
    const subdir = raw !== true && typeof raw.subdir === 'string' ? raw.subdir : undefined

    map.set(slug, {
      sourceField,
      subdir,
    })
  }

  return map
}

function buildModel(definitions: SeedDefinition[]): BuiltModel {
  const collections: BuiltCollection[] = []
  const globals: BuiltGlobal[] = []

  for (const def of definitions) {
    if (def.kind === 'collection') {
      const records: BuiltRecord[] = def.build(tokens).map((rec) => {
        const {
          _file,
          _key,
          ...data
        } = isRecord(rec) ? rec : {}

        return {
          data,
          file: isFileToken(_file) ? _file : undefined,
          key: typeof _key === 'string' ? _key : '',
        }
      })

      collections.push({
        records,
        slug: def.slug,
      })
    }
    else if (def.kind === 'global') {
      const built = def.build(tokens)

      globals.push({
        data: isRecord(built) ? built : {},
        slug: def.slug,
      })
    }
  }

  return {
    collections,
    globals,
  }
}

function partitionDefinitions(payload: Payload, defs: SeedDefinition[]): { active: SeedDefinition[]
  skipped: SkippedDefinition[] } {
  const active: SeedDefinition[] = []
  const skipped: SkippedDefinition[] = []

  for (const def of defs) {
    const rawDisabled = def.kind === 'collection' ? payload.collections[def.slug]?.config.custom?.seedDisabled : undefined
    const fromCollection = typeof rawDisabled === 'boolean' || typeof rawDisabled === 'string' ? rawDisabled : undefined
    const flag = def.disabled || fromCollection

    if (!flag) {
      active.push(def)

      continue
    }
    const reason = typeof flag === 'string' ? flag : 'disabled'

    skipped.push({
      reason,
      slug: def.slug,
    })
    payload.logger.warn(`[payload-seed] skipping '${def.slug}': ${reason}`)
  }

  return {
    active,
    skipped,
  }
}

function stripRefsToSkipped(
  payload: Payload,
  model: BuiltModel,
  skipped: SkippedDefinition[],
  requiredFields: Map<string, Set<string>>,
): void {
  if (skipped.length === 0) {
    return
  }
  const issues: string[] = []
  const reasonBySlug = new Map(skipped.map((s) => [
    s.slug,
    s.reason,
  ]))

  const strip = (where: string, slug: string | undefined, data: Record<string, unknown>) => {
    for (const [
      field,
      value,
    ] of Object.entries(data)) {
      const hit = collectTokens(value).find((t) => isRef(t) && reasonBySlug.has(t.collection))

      if (!hit || !isRef(hit)) {
        continue
      }
      if (slug && requiredFields.get(slug)?.has(field)) {
        issues.push(
          `${where}.${field}: required, but ref('${hit.collection}', '${hit.key}') targets a skipped definition (${reasonBySlug.get(hit.collection)}).`,
        )

        continue
      }

      delete data[field]
      payload.logger.warn(
        `[payload-seed] dropping entire field '${field}' on ${where} (contains ref('${hit.collection}', '${hit.key}') to skipped '${hit.collection}': ${reasonBySlug.get(hit.collection)}).`,
      )
    }
  }

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      strip(docNodeId(coll.slug, rec.key), coll.slug, rec.data)
    }
  }
  for (const g of model.globals) {
    strip(`global:${g.slug}`, undefined, g.data)
  }

  if (issues.length > 0) {
    throw new SeedValidationError(issues)
  }
}

async function clearCollection(payload: Payload, req: PayloadRequest, collection: string): Promise<void> {
  const config = payload.collections[collection]?.config

  if (!config) {
    return
  }

  payload.logger.info(`[payload-seed] clearing ${collection}`)

  const withHooks = Boolean(config.upload || config.hooks?.beforeDelete?.length || config.hooks?.afterDelete?.length)

  if (withHooks) {
    const result = await payload.delete({
      collection,
      context: {
        disableRevalidate: true,
      },
      disableTransaction: true,
      req,
      where: {
        id: {
          exists: true,
        },
      },
    })
    const failed: Array<{ label: string
      reason: string }> = []

    for (const e of result?.errors ?? []) {
      if (e.id == null) {
        continue
      }
      try {
        await payload.delete({
          id: e.id,
          collection,
          context: {
            disableRevalidate: true,
          },
          disableTransaction: true,
          req,
        })
      }
      catch (error) {
        const reason = deepestReason(error, e.message)
        const label = await describeFailedDoc(payload, req, collection, config.admin?.useAsTitle, e.id)

        failed.push({
          label,
          reason,
        })
      }
    }
    if (failed.length > 0) {
      const detail = failed.map((f) => `${f.label}: ${f.reason}`).join(' | ')

      payload.logger.warn(
        `[payload-seed] could not clear ${failed.length} doc(s) in '${collection}' — these STALE docs now sit beside the fresh seed; re-run the seed or delete them in the admin. Reasons: ${detail}`,
      )
    }
  }
  else {
    await payload.db.deleteMany({
      collection,
      req,
      where: {},
    })
  }
  if (config.versions) {
    await payload.db.deleteVersions({
      collection,
      req,
      where: {},
    })
  }
}

export async function runSeed({
  definitions,
  options,
  payload,
  req,
}: RunSeedArgs): Promise<SeedResult> {
  const defs = definitions ?? options.definitions ?? []

  if (defs.length === 0) {
    payload.logger.warn('[payload-seed] no seed definitions: pass `definitions` to seedPlugin() or seed().')
  }

  const {
    active, skipped,
  } = partitionDefinitions(payload, defs)

  const model = buildModel(active)
  const collectionSlugs = new Set(Object.keys(payload.collections))

  const isUpload = (slug: string): boolean => Boolean(payload.collections[slug]?.config.upload)
  const assetBySlug = discoverAssetCollections(payload)

  const fileCollections = new Set<string>([
    ...collectionSlugs,
  ].filter(isUpload))

  for (const slug of assetBySlug.keys()) {
    fileCollections.add(slug)
  }

  const fieldNames = new Map<string, Set<string>>()
  const requiredFields = new Map<string, Set<string>>()

  for (const coll of model.collections) {
    const cfg = payload.collections[coll.slug]?.config

    if (!cfg) {
      continue
    }

    fieldNames.set(coll.slug, new Set(cfg.flattenedFields.map((f) => f.name)))
    requiredFields.set(coll.slug, new Set(cfg.flattenedFields.filter((f) => 'required' in f && f.required).map((f) => f.name)))
  }
  for (const g of model.globals) {
    const cfg = payload.config.globals.find((gc) => gc.slug === g.slug)

    if (cfg) {
      fieldNames.set(`global:${g.slug}`, new Set(cfg.flattenedFields.map((f) => f.name)))
    }
  }

  stripRefsToSkipped(payload, model, skipped, requiredFields)

  const globalSlugs = new Set(payload.config.globals.map((g) => g.slug))

  validateModel({
    collectionSlugs,
    fieldNames,
    fileCollections,
    globalSlugs,
    model,
  })

  const isRequired = (collection: string, field: string): boolean => requiredFields.get(collection)?.has(field) ?? false
  const {
    deferred, order,
  } = buildGraph(model, {
    isRequired,
  })

  const deferredByNode = new Map<string, Set<string>>()

  for (const d of deferred) {
    const set = deferredByNode.get(d.node) ?? new Set<string>()

    set.add(d.field)
    deferredByNode.set(d.node, set)
  }

  const baseArgs = {
    context: {
      disableRevalidate: true,
    },
    depth: 0,
    req,
  } as const
  const locales = getSeedLocales(payload, options)
  const localization = payload.config.localization
  const defaultLocale = localization && typeof localization.defaultLocale === 'string'
    ? localization.defaultLocale
    : locales[0]
  const localeSet = new Set(locales)
  const dataForLocale = (data: Record<string, unknown>, locale: string | undefined): Record<string, unknown> => {
    if (!locale || locales.length === 0) {
      return data
    }
    const selected = selectLocaleValue(data, locale, defaultLocale ?? locale, localeSet)

    return isRecord(selected) ? selected : {}
  }

  const docIds = new Map<string, number | string>()
  const recordIndex = new Map<string, { record: BuiltRecord
    slug: string }>()

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      recordIndex.set(docNodeId(coll.slug, rec.key), {
        record: rec,
        slug: coll.slug,
      })
    }
  }

  const skipIfExistsBySlug = new Map(
    active
      .filter((definition): definition is Extract<SeedDefinition, { kind: 'collection' }> => definition.kind === 'collection')
      .map((definition) => [
        definition.slug,
        definition.skipIfExists,
      ]),
  )
  const reusedCollections = new Set<string>()

  for (const coll of model.collections) {
    if (!skipIfExistsBySlug.get(coll.slug)) {
      continue
    }

    const existing = await payload.find({
      collection: coll.slug as never,
      depth: 0,
      pagination: false,
      req,
    })

    if (existing.docs.length === 0) {
      continue
    }
    if (existing.docs.length !== coll.records.length) {
      throw new SeedValidationError([
        `Cannot reuse '${coll.slug}': its definition has ${coll.records.length} record(s), but ${existing.docs.length} existing record(s) were found.`,
      ])
    }

    reusedCollections.add(coll.slug)

    for (const [
      index,
      record,
    ] of coll.records.entries()) {
      const existingDoc = existing.docs[index]

      if (!existingDoc?.id) {
        continue
      }

      docIds.set(docNodeId(coll.slug, record.key), existingDoc.id as number | string)
    }

    payload.logger.info(`[payload-seed] reusing ${existing.docs.length} existing '${coll.slug}' record(s)`)
  }

  const seededCollections = [
    ...new Set(model.collections.map((c) => c.slug)),
  ]
  const creationOrder: string[] = []
  const seen = new Set<string>()

  for (const nodeId of order) {
    const slug = recordIndex.get(nodeId)?.slug

    if (slug && !seen.has(slug)) {
      seen.add(slug)
      creationOrder.push(slug)
    }
  }
  for (const slug of seededCollections) {
    if (!seen.has(slug)) {
      creationOrder.push(slug)
    }
  }

  payload.logger.info('[payload-seed] clearing collections...')

  for (const slug of creationOrder.toReversed()) {
    if (reusedCollections.has(slug)) {
      continue
    }

    await clearCollection(payload, req, slug)
  }

  const created: Record<string, number> = {}

  payload.logger.info('[payload-seed] seeding documents...')

  for (const nodeId of order) {
    const entry = recordIndex.get(nodeId)

    if (!entry) {
      continue
    }
    const {
      record, slug,
    } = entry

    if (docIds.has(nodeId)) {
      continue
    }
    const deferFields = deferredByNode.get(nodeId)
    const source = deferFields
      ? Object.fromEntries(Object.entries(record.data).filter(([
          k,
        ]) => !deferFields.has(k)))
      : record.data
    const resolved = resolveTokens(source, {
      docs: docIds,
      where: nodeId,
    })
    let data: Record<string, unknown> = isRecord(resolved) ? resolved : {}
    let uploadFile: Awaited<ReturnType<typeof readFileAsUpload>> | undefined

    if (record.file) {
      const asset = assetBySlug.get(slug)
      const subdir = asset?.subdir ?? options.options.assetSubDirs[slug] ?? slug
      const subdirs = [
        subdir,
        '',
      ]
      const path = await resolveFilePath(record.file.name, options.options.assetsDir, subdirs)

      if (!path) {
        const searched = searchedDirs(record.file.name, options.options.assetsDir, subdirs).join(', ')

        payload.logger.warn({
          msg: `[payload-seed] ${nodeId}: _file '${record.file.name}' not found - skipped. Searched: ${searched}`,
        })
      }
      else if (asset) {
        data = {
          ...data,
          [asset.sourceField]: {
            file: path,
            ...record.file.options,
          },
        }
      }
      else if (isUpload(slug)) {
        uploadFile = await readFileAsUpload(path)
      }
    }

    payload.logger.info(`[payload-seed] seeding '${nodeId}'`)

    let doc: { id: number | string }

    try {
      doc = await payload.create({
        collection: slug,
        data: dataForLocale(data, defaultLocale),
        ...(uploadFile
          ? {
              file: uploadFile,
            }
          : {}),
        ...(defaultLocale
          ? {
              locale: defaultLocale,
            }
          : {}),
        ...baseArgs,
      })
    }
    catch (error) {
      throw new SeedRunError(`creating '${nodeId}': ${deepestReason(error)}`)
    }

    // A document is created once, then localized values are written in every
    // configured locale. This also keeps references stable across locales.
    for (const locale of locales) {
      try {
        const existing = await payload.findByID({
          id: doc.id,
          collection: slug,
          locale: defaultLocale,
          ...baseArgs,
        })

        await payload.update({
          id: doc.id,
          collection: slug,
          data: preserveNestedIds(dataForLocale(data, locale), existing) as Record<string, unknown>,
          locale,
          ...baseArgs,
        })
      }
      catch (error) {
        throw new SeedRunError(`localizing '${nodeId}' for '${locale}': ${deepestReason(error)}`)
      }
    }

    docIds.set(nodeId, doc.id)
    created[slug] = (created[slug] ?? 0) + 1
  }

  if (deferred.length > 0) {
    payload.logger.info(`[payload-seed] resolving ${deferred.length} deferred reference(s)...`)

    for (const {
      field, node,
    } of deferred) {
      const entry = recordIndex.get(node)
      const id = docIds.get(node)

      if (!entry || id === undefined) {
        continue
      }
      const value = resolveTokens(entry.record.data[field], {
        docs: docIds,
        where: `${node}.${field}`,
      })

      try {
        if (locales.length === 0) {
          await payload.update({
            id,
            collection: entry.slug,
            data: {
              [field]: value,
            },
            ...baseArgs,
          })
        }
        else {
          for (const locale of locales) {
            const localizedValue = selectLocaleValue(value, locale, defaultLocale ?? locale, localeSet)

            await payload.update({
              id,
              collection: entry.slug,
              data: {
                [field]: localizedValue,
              },
              locale,
              ...baseArgs,
            })
          }
        }
      }
      catch (error) {
        throw new SeedRunError(`setting deferred field '${node}.${field}': ${deepestReason(error)}`)
      }
    }
  }

  for (const g of model.globals) {
    payload.logger.info(`[payload-seed] seeding global '${g.slug}'`)

    const resolvedGlobal = resolveTokens(g.data, {
      docs: docIds,
      where: `global:${g.slug}`,
    })
    const data: Record<string, unknown> = isRecord(resolvedGlobal) ? resolvedGlobal : {}

    try {
      if (locales.length === 0) {
        await payload.updateGlobal({
          data,
          slug: g.slug,
          ...baseArgs,
        })
      }
      else {
        for (const locale of locales) {
          await payload.updateGlobal({
            data: dataForLocale(data, locale),
            locale,
            slug: g.slug,
            ...baseArgs,
          })
        }
      }
    }
    catch (error) {
      throw new SeedRunError(`updating global '${g.slug}': ${deepestReason(error)}`)
    }
  }

  payload.logger.info('[payload-seed] seed complete.')

  const result: SeedResult = {
    collections: model.collections.map((c) => c.slug),
    created,
    deferred,
    globals: model.globals.map((g) => g.slug),
    order,
    skipped,
  }

  await notifyAfterSeed(payload, req, result)

  return result
}

export async function seed(args: { options?: SeedPluginOptions
  payload: Payload
  req?: PayloadRequest }): Promise<SeedResult> {
  const req = args.req ?? (await createLocalReq({}, args.payload))

  return runSeed({
    options: resolveOptions(args.options),
    payload: args.payload,
    req,
  })
}
