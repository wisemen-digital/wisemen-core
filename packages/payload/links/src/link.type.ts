/* eslint-disable unicorn/no-keyword-prefix */
import type { LinkableCollectionSlug } from '#links.registry.ts'

export interface LinkReferenceValue {
  id?: string | null
  slug?: string | null
}

export interface LinkFieldDocument<TRelationTo extends string = LinkableCollectionSlug> {
  newTab?: boolean | null
  reference?: {
    relationTo?: TRelationTo | null
    value?: string | LinkReferenceValue | null
  } | null
  type: 'custom' | 'reference'
  url?: string | null
}
