import { LinkTransformer } from '@wisemen/payload-core-links'
import {
  getFallbackLocale,
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { ClientSettingsHomePage } from '#models/index.ts'
import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsHomepage({
  context,
}: {
  context: SettingsQueryContext
}): Promise<ClientSettingsHomePage | null> {
  const fallbackLocale = getFallbackLocale()
  const payload = await getPayload()

  const paginatedHomePages = await payload.find({
    collection: 'settings',
    fallbackLocale,
    locale: context.locale,
    select: {
      contact: false,
      footer: false,
      general: false,
      header: false,
      socials: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  const foundHome = paginatedHomePages.docs[0].home

  return foundHome?.homePage != null
    ? LinkTransformer.toClientLink(foundHome.homePage)
    : null
}
