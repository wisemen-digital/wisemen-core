import type { LinkFieldDocument } from '#link.type.ts'
import type {
  LinkableCollectionSlug,
  NavigationLinkEventValue,
} from '#links.registry.ts'

export interface NavigationDropdownItemDocument<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> {
  event?: TEvent | null
  label: string
  link?: LinkFieldDocument<TRelationTo> | null
  navType: 'event' | 'link'
}

export interface NavigationDropdownDocument<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> {
  label: string
  links?: NavigationDropdownItemDocument<TRelationTo, TEvent>[] | null
  navType: 'dropdown'
}

export interface NavigationEventDocument<TEvent extends string = NavigationLinkEventValue> {
  event?: TEvent | null
  label: string
  navType: 'event'
}

export interface NavigationLinkRelationDocument<TRelationTo extends string = LinkableCollectionSlug> {
  label: string
  link?: LinkFieldDocument<TRelationTo> | null
  navType: 'link'
}

export type NavigationLinkDocument<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>
  = | NavigationDropdownDocument<TRelationTo, TEvent>
    | NavigationEventDocument<TEvent>
    | NavigationLinkRelationDocument<TRelationTo>

export interface HeaderNavigationRowDocument<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> {
  navLink: NavigationLinkDocument<TRelationTo, TEvent>
}
