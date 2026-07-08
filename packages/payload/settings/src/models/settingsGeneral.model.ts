import { z } from 'zod'

export const clientSettingsGeneralSchema = z.object({})

export type ClientSettingsGeneral = z.infer<typeof clientSettingsGeneralSchema>
