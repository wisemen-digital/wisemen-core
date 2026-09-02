import {
  getFallbackLocale,
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { ClientSettingsContact } from '#models/index.ts'
import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsContact({
  context,
}: {
  context: SettingsQueryContext
}): Promise<ClientSettingsContact> {
  const fallbackLocale = getFallbackLocale()
  const payload = await getPayload()

  const paginatedContact = await payload.find({
    collection: 'settings',
    fallbackLocale,
    locale: context.locale,
    select: {
      footer: false,
      general: false,
      header: false,
      home: false,
      socials: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  const foundContact = paginatedContact.docs[0].contact

  return {
    email: foundContact?.email ?? null,
    phone: foundContact?.phone ?? null,
    whatsappLink: foundContact?.whatsappLink ?? null,
  }
}
