import { NavigationLinkTransformer } from '@wisemen/payload-core-links'
import {
  getFallbackLocale,
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { ClientSettingsHeader } from '#models/index.ts'
import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsHeader({
  context,
}: {
  context: SettingsQueryContext
}): Promise<ClientSettingsHeader> {
  const fallbackLocale = getFallbackLocale()
  const payload = await getPayload()

  const paginatedHeaders = await payload.find({
    collection: 'settings',
    depth: 20,
    fallbackLocale,
    locale: context.locale,
    select: {
      contact: false,
      footer: false,
      general: false,
      home: false,
      socials: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  const foundHeader = paginatedHeaders.docs[0].header

  return {
    headerLinks: foundHeader?.links?.map(NavigationLinkTransformer.toClientNavigationLink) ?? [],
    subheaderLinks: foundHeader?.subheaderLinks?.map(NavigationLinkTransformer.toClientNavigationLink) ?? [],
  }
}
