import { z } from 'zod'

export const linkRelationSchema = z.object({
  reference: z.object({
    relationTo: z.enum([
      'pages',
      'articles',
    ]).nullable(),
    value: z.object({
      id: z.string().nullable(),
      slug: z.string().nullable(),
    }).nullable(),
  }).nullable(),
  toNewTab: z.boolean(),
  type: z.literal('reference'),
})

export const linkCustomSchema = z.object({
  toNewTab: z.boolean(),
  type: z.literal('custom'),
  url: z.string(),
})

export const clientLinkSchema = z.discriminatedUnion('type', [
  linkRelationSchema,
  linkCustomSchema,
])
export type ClientLink = z.infer<typeof clientLinkSchema>
