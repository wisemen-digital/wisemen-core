import { z } from 'zod'

export const clientSettingsContactSchema = z.object({
  email: z.string().nullable(),
  phone: z.string().nullable(),
  whatsappLink: z.string().nullable(),
})

export type ClientSettingsContact = z.infer<typeof clientSettingsContactSchema>
