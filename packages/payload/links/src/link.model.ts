import { z } from 'zod'

import type {
  LinkableCollectionSlug,
  NonEmptyReadonlyArray,
} from '#links.registry.ts'

export interface ClientLinkReferenceValue {
  id: string | null
  slug: string | null
}

export interface ClientReferenceLink<TRelationTo extends string = LinkableCollectionSlug> {
  reference: {
    relationTo: TRelationTo | null
    value: ClientLinkReferenceValue | null
  } | null
  toNewTab: boolean
  type: 'reference'
}

export interface ClientCustomLink {
  toNewTab: boolean
  type: 'custom'
  url: string
}

export type ClientLink<TRelationTo extends string = LinkableCollectionSlug>
  = | ClientCustomLink
    | ClientReferenceLink<TRelationTo>

const clientLinkReferenceValueSchema = z.object({
  id: z.string().nullable(),
  slug: z.string().nullable(),
}) satisfies z.ZodType<ClientLinkReferenceValue>

export function createLinkRelationSchema<TRelationTo extends string = LinkableCollectionSlug>(options: {
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientReferenceLink<TRelationTo>> {
  const relationToSchema = options.relationTo == null
    ? z.string()
    : z.enum(options.relationTo)

  return z.object({
    reference: z.object({
      relationTo: relationToSchema.nullable(),
      value: clientLinkReferenceValueSchema.nullable(),
    }).nullable(),
    toNewTab: z.boolean(),
    type: z.literal('reference'),
  }) as z.ZodType<ClientReferenceLink<TRelationTo>>
}

export const linkCustomSchema = z.object({
  toNewTab: z.boolean(),
  type: z.literal('custom'),
  url: z.string(),
}) satisfies z.ZodType<ClientCustomLink>

export function createClientLinkSchema<TRelationTo extends string = LinkableCollectionSlug>(options: {
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientLink<TRelationTo>> {
  return z.union([
    createLinkRelationSchema(options),
    linkCustomSchema,
  ])
}

export const linkRelationSchema = createLinkRelationSchema()
export const clientLinkSchema = createClientLinkSchema()
