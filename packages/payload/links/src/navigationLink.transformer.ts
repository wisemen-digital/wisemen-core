import { LinkTransformer } from '#link.transformer.ts'
import type { ClientNavigationLink } from '#navigationLink.model.ts'
import { clientNavigationLinkSchema } from '#navigationLink.model.ts'
import { toClientNavigationLinksDropdown } from '#navigationLink.transformer.helper.ts'
import type { HeaderNavigationRowDocument } from '#navigationLink.type.ts'

type NavLink = HeaderNavigationRowDocument

export type DropdownNavLink = NavLink['navLink']

export class NavigationLinkTransformer {
  static toClientNavigationLink(nav: NavLink): ClientNavigationLink {
    const parsedLink = nav.navLink.navType === 'link' && nav.navLink.link ? LinkTransformer.toClientLink(nav.navLink.link) : undefined

    if (nav.navLink.navType === 'dropdown') {
      return toClientNavigationLinksDropdown(nav.navLink)
    }

    return clientNavigationLinkSchema.parse({
      event: nav.navLink.navType === 'event' && nav.navLink.event != null ? nav.navLink.event : undefined,
      label: nav.navLink.label,
      link: parsedLink,
      navType: nav.navLink.navType,
    })
  }
}
