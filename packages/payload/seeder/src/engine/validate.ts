import { isRef } from '#refs'
import type { ValidateArgs } from '#types'

import {
  collectTokens,
  docNodeId,
} from './tokens'

export class SeedValidationError extends Error {
  constructor(public issues: string[]) {
    super(`[payload-seed] seed data failed validation:\n${issues.map((i) => `  - ${i}`).join('\n')}`)
    this.name = 'SeedValidationError'
  }
}

export class SeedRunError extends Error {
  constructor(public detail: string) {
    super(`[payload-seed] seed run failed while ${detail}`)
    this.name = 'SeedRunError'
  }
}

const ALLOWED_NON_FIELDS = new Set([
  '_status',
])

export function validateModel({
  collectionSlugs,
  fieldNames,
  fileCollections,
  globalSlugs,
  model,
}: ValidateArgs): void {
  const issues: string[] = []
  const docIds = new Set<string>()

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      docIds.add(docNodeId(coll.slug, rec.key))
    }
  }

  for (const coll of model.collections) {
    if (!collectionSlugs.has(coll.slug)) {
      issues.push(`defineSeed('${coll.slug}'): no collection '${coll.slug}' in the Payload config - fix the slug or add the collection.`)
    }
  }
  for (const g of model.globals) {
    if (!globalSlugs.has(g.slug)) {
      issues.push(`defineSeed('${g.slug}'): no global '${g.slug}' in the Payload config - fix the slug or add the global.`)
    }
  }

  const check = (where: string, data: unknown) => {
    for (const token of collectTokens(data)) {
      if (!isRef(token)) {
        continue
      }
      if (!collectionSlugs.has(token.collection)) {
        issues.push(`${where}: ref('${token.collection}', '${token.key}') targets unknown collection '${token.collection}'.`)
      }
      else if (!docIds.has(docNodeId(token.collection, token.key))) {
        issues.push(`${where}: ref('${token.collection}', '${token.key}') - no seeded '${token.collection}' doc has _key '${token.key}'.`)
      }
    }
  }

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      check(`${coll.slug}:${rec.key}`, rec.data)
    }
  }
  for (const g of model.globals) {
    check(`global:${g.slug}`, g.data)
  }

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      if (rec.file && !fileCollections.has(coll.slug)) {
        issues.push(`${coll.slug}:${rec.key}: _file set, but '${coll.slug}' is not an upload collection or a custom.seedAsset collection.`)
      }
    }
  }

  const checkFields = (where: string, slug: string, data: Record<string, unknown>) => {
    const valid = fieldNames?.get(slug)

    if (!valid) {
      return
    }
    for (const key of Object.keys(data)) {
      if (!valid.has(key) && !ALLOWED_NON_FIELDS.has(key)) {
        issues.push(`${where}: unknown field '${key}' - not in the '${slug}' schema.`)
      }
    }
  }

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      checkFields(`${coll.slug}:${rec.key}`, coll.slug, rec.data)
    }
  }
  for (const g of model.globals) {
    checkFields(`global:${g.slug}`, `global:${g.slug}`, g.data)
  }

  const seenBySlug = new Map<string, Set<string>>()

  for (const coll of model.collections) {
    const seen = seenBySlug.get(coll.slug) ?? new Set<string>()

    seenBySlug.set(coll.slug, seen)

    for (const rec of coll.records) {
      if (seen.has(rec.key)) {
        issues.push(`${coll.slug}: duplicate _key '${rec.key}'.`)
      }

      seen.add(rec.key)
    }
  }

  if (issues.length > 0) {
    throw new SeedValidationError(issues)
  }
}
