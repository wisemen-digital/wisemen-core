import type { FileToken } from '#types/tokens/tokens'

export interface BuiltRecord {
  data: Record<string, unknown>
  file?: FileToken
  key: string
}

export interface BuiltCollection {
  records: BuiltRecord[]
  slug: string
}

export interface BuiltGlobal {
  data: Record<string, unknown>
  slug: string
}

export interface BuiltModel {
  collections: BuiltCollection[]
  globals: BuiltGlobal[]
}
