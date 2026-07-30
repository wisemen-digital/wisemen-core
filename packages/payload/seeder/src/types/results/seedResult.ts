import type { DeferredField } from '#types/graph/graph'

export interface SeedResult {
  collections: string[]
  created: Record<string, number>
  deferred: DeferredField[]
  globals: string[]
  order: string[]
  skipped: SkippedDefinition[]
}

export interface SkippedDefinition {
  reason: string
  slug: string
}
