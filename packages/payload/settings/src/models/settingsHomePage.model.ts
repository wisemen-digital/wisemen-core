import { clientLinkSchema } from '@wisemen/payload-core-links'
import type { z } from 'zod'

export const clientSettingsHomePageSchema = clientLinkSchema
export type ClientSettingsHomePage = z.infer<typeof clientSettingsHomePageSchema>
