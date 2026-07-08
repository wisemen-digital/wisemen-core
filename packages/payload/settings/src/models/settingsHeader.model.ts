import { clientNavigationLinkSchema } from '@wisemen/payload-core-links'
import { z } from 'zod'

export const clientSettingsHeaderSchema = z.object({
  headerLinks: z.array(clientNavigationLinkSchema),
  subheaderLinks: z.array(clientNavigationLinkSchema),
})
export type ClientSettingsHeader = z.infer<typeof clientSettingsHeaderSchema>
