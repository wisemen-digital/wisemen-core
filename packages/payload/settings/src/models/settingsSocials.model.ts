import { z } from 'zod'

export const clientSettingsSocialsSchema = z.object({
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  linkedin: z.string().nullable(),
  pinterest: z.string().nullable(),
  tiktok: z.string().nullable(),
  youtube: z.string().nullable(),
})
export type ClientSettingsSocials = z.infer<typeof clientSettingsSocialsSchema>
