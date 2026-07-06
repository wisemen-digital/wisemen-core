import { LinkTransformer } from '@wisemen/payload-core-links'
import {
  getFallbackLocale,
  getPayload,
  getTenantQuery,
} from '@wisemen/payload-core-utils'

import type { ClientSettingsFooter } from '#models/index.ts'
import { clientSettingsFooterSchema } from '#models/index.ts'
import type { SettingsQueryContext } from '#settings.queries.types.ts'

export async function getSettingsFooter({
  context,
}: {
  context: SettingsQueryContext
}): Promise<ClientSettingsFooter> {
  const fallbackLocale = getFallbackLocale()
  const payload = await getPayload()

  const paginatedFooters = await payload.find({
    collection: 'settings',
    fallbackLocale,
    locale: context.locale,
    select: {
      contact: false,
      general: false,
      header: false,
      home: false,
      socials: false,
    },
    where: {
      ...getTenantQuery(context.tenantId),
    },
  })

  const foundFooter = paginatedFooters.docs[0].footer

  return clientSettingsFooterSchema.parse(
    (foundFooter?.sections)?.map((section) => ({
      title: section.title ?? null,
      link: section.link ? LinkTransformer.toClientLink(section.link) : null,
      links: section.links?.flatMap((link) => {
        if (link.label == null) {
          return []
        }

        if (link.navType === 'event') {
          if (link.event == null) {
            return []
          }

          return {
            event: link.event,
            label: link.label,
            navType: 'event' as const,
            variant: link.variant ?? 'default',
          }
        }

        if (link.link == null) {
          return []
        }

        return {
          label: link.label,
          link: LinkTransformer.toClientLink(link.link),
          navType: 'link' as const,
          variant: link.variant ?? 'default',
        }
      }) ?? [],
    })) ?? [],
  )
}
