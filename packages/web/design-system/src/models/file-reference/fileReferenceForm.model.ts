import { z } from 'zod'

export const fileReferenceFormSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  blurHash: z.string().nullable(),
  mimeType: z.string(),
  order: z.number(),
  url: z.string().nullable(),
})

export type FileReferenceForm = z.infer<typeof fileReferenceFormSchema>
