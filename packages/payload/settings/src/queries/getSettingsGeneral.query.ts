import {
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsGeneral({
  context,
}: {
  context: SettingsQueryContext
}): Promise<Record<string, never>> {
  const payload = await getPayload()

  await payload.find({
    collection: 'settings',
    locale: context.locale,
    select: {
      contact: false,
      footer: false,
      header: false,
      home: false,
      socials: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  return {}
}
