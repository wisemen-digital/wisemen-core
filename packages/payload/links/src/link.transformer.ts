import type { ClientLink } from '#link.model.ts'
import { clientLinkSchema } from '#link.model.ts'
import type { LinkFieldDocument } from '#link.type.ts'

export class LinkTransformer {
  static toClientLink(link: LinkFieldDocument): ClientLink {
    return clientLinkSchema.parse({
      reference: {
        relationTo: link.reference?.relationTo ?? null,
        value: link.reference?.value && typeof link.reference?.value !== 'string'
          ? {
              id: link.reference?.value?.id ?? null,
              slug: link.reference?.value?.slug ?? null,
            }
          : null,
      },
      toNewTab: link.newTab,
      type: link.type,
      url: link.url,
    })
  }
}
