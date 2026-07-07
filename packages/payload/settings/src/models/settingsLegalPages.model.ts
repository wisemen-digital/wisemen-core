import { z } from 'zod'

export const clientSettingsLegalPagesSchema = z.object({
  cookiePolicy: z.any().nullable(),
  privacyPolicy: z.any().nullable(),
  termsAndConditions: z.any().nullable(),
})

export type ClientSettingsLegalPages = z.infer<typeof clientSettingsLegalPagesSchema>
