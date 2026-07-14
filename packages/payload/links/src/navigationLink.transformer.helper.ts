import { LinkTransformer } from '#link.transformer.ts'
import type {
  LinkableCollectionSlug,
  NavigationLinkEventValue,
  NonEmptyReadonlyArray,
} from '#links.registry.ts'
import type { ClientNavigationDropdown } from '#navigationLink.model.ts'
import type { DropdownNavLink } from '#navigationLink.transformer.ts'

export interface ToClientNavigationLinksDropdownOptions<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> {
  events?: NonEmptyReadonlyArray<TEvent>
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
}

export function toClientNavigationLinksDropdown<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>(
  dropdownNavLink: DropdownNavLink<TRelationTo, TEvent>,
  options: ToClientNavigationLinksDropdownOptions<TRelationTo, TEvent> = {},
): ClientNavigationDropdown<TRelationTo, TEvent> {
  if (dropdownNavLink.navType !== 'dropdown') {
    throw new Error('Can only be dropdown type')
  }

  if (dropdownNavLink.links == null) {
    throw new Error('Dropdown nav link must have links')
  }

  return {
    label: dropdownNavLink.label,
    links: dropdownNavLink.links.map((link) => {
      if (link.link == null) {
        throw new Error('Link nav link must have a link')
      }

      if (link.navType === 'event') {
        if (link.event == null) {
          throw new Error('Event nav link must have an event')
        }

        return {
          class: 'cursor-pointer',
          event: link.event,
          label: link.label,
          navType: 'event',
        }
      }

      return {
        label: link.label,
        link: LinkTransformer.toClientLink(link.link, {
          relationTo: options.relationTo,
        }),
        navType: 'link',
      }
    }) ?? [],
    navType: dropdownNavLink.navType,
  }
}
