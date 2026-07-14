import {
  getDefaultEvents,
  getDefaultLinkableCollections,
} from '@wisemen/payload-core-utils'

import { LinkTransformer } from '#link.transformer.ts'
import type {
  LinkableCollectionSlug,
  NavigationLinkEventValue,
  NonEmptyReadonlyArray,
} from '#links.registry.ts'
import { toNonEmptyReadonlyArray } from '#links.registry.ts'
import type { ClientNavigationLink } from '#navigationLink.model.ts'
import { createClientNavigationLinkSchema } from '#navigationLink.model.ts'
import { toClientNavigationLinksDropdown } from '#navigationLink.transformer.helper.ts'
import type { HeaderNavigationRowDocument } from '#navigationLink.type.ts'

type NavLink<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> = HeaderNavigationRowDocument<TRelationTo, TEvent>

export type DropdownNavLink<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> = NavLink<TRelationTo, TEvent>['navLink']

export interface ToClientNavigationLinkOptions<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> {
  events?: NonEmptyReadonlyArray<TEvent>
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
}

export class NavigationLinkTransformer {
  static toClientNavigationLink<
    TRelationTo extends string = LinkableCollectionSlug,
    TEvent extends string = NavigationLinkEventValue,
  >(
    nav: NavLink<TRelationTo, TEvent>,
    options: ToClientNavigationLinkOptions<TRelationTo, TEvent> = {},
  ): ClientNavigationLink<TRelationTo, TEvent> {
    const relationTo = options.relationTo
      ?? toNonEmptyReadonlyArray(getDefaultLinkableCollections() as unknown as readonly TRelationTo[])
    const events = options.events
      ?? toNonEmptyReadonlyArray(getDefaultEvents().map((event) => event.id) as unknown as readonly TEvent[])

    const parsedLink = nav.navLink.navType === 'link' && nav.navLink.link
      ? LinkTransformer.toClientLink(nav.navLink.link, {
          relationTo,
        })
      : undefined

    if (nav.navLink.navType === 'dropdown') {
      return toClientNavigationLinksDropdown(nav.navLink, {
        events,
        relationTo,
      })
    }

    return createClientNavigationLinkSchema<TRelationTo, TEvent>({
      events,
      relationTo,
    }).parse({
      event: nav.navLink.navType === 'event' && nav.navLink.event != null ? nav.navLink.event : undefined,
      label: nav.navLink.label,
      link: parsedLink,
      navType: nav.navLink.navType,
    })
  }
}
