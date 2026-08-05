import {
  getFallbackLocale,
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { ClientSettingsSocials } from '#models/index.ts'
import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsSocials({
  context,
}: {
  context: SettingsQueryContext
}): Promise<ClientSettingsSocials> {
  const fallbackLocale = getFallbackLocale()
  const payload = await getPayload()

  const paginatedSocials = await payload.find({
    collection: 'settings',
    fallbackLocale,
    locale: context.locale,
    select: {
      contact: false,
      footer: false,
      general: false,
      header: false,
      home: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  const foundSocials = paginatedSocials.docs[0].socials

  return {
    facebook: foundSocials?.facebook ?? null,
    instagram: foundSocials?.instagram ?? null,
    linkedin: foundSocials?.linkedin ?? null,
    pinterest: foundSocials?.pinterest ?? null,
    tiktok: foundSocials?.tiktok ?? null,
    youtube: foundSocials?.youtube ?? null,
  }
}
