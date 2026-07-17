import { getDefaultLinkableCollections } from '@wisemen/payload-core-utils'

import type { ClientLink } from '#link.model.ts'
import { createClientLinkSchema } from '#link.model.ts'
import type { LinkFieldDocument } from '#link.type.ts'
import type {
  LinkableCollectionSlug,
  NonEmptyReadonlyArray,
} from '#links.registry.ts'
import { toNonEmptyReadonlyArray } from '#links.registry.ts'

export interface ToClientLinkOptions<TRelationTo extends string = LinkableCollectionSlug> {
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
}

export class LinkTransformer {
  static toClientLink<TRelationTo extends string = LinkableCollectionSlug>(
    link: LinkFieldDocument<TRelationTo>,
    options: ToClientLinkOptions<TRelationTo> = {},
  ): ClientLink<TRelationTo> {
    const relationTo = options.relationTo
      ?? toNonEmptyReadonlyArray(getDefaultLinkableCollections() as unknown as readonly TRelationTo[])

    return createClientLinkSchema<TRelationTo>({
      relationTo,
    }).parse({
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
