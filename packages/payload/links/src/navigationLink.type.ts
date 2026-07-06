import type { LinkFieldDocument } from '#link.type.ts'

export interface NavigationDropdownItemDocument {
  event?: string | null
  label: string
  link?: LinkFieldDocument | null
  navType: 'link' | 'event'
}

export interface NavigationDropdownDocument {
  label: string
  links?: NavigationDropdownItemDocument[] | null
  navType: 'dropdown'
}

export interface NavigationEventDocument {
  event?: string | null
  label: string
  navType: 'event'
}

export interface NavigationLinkRelationDocument {
  label: string
  link?: LinkFieldDocument | null
  navType: 'link'
}

export type NavigationLinkDocument =
  | NavigationDropdownDocument
  | NavigationEventDocument
  | NavigationLinkRelationDocument

export interface HeaderNavigationRowDocument {
  navLink: NavigationLinkDocument
}
