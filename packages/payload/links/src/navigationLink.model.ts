import { z } from 'zod'

import type { ClientLink } from '#link.model.ts'
import { createClientLinkSchema } from '#link.model.ts'
import type {
  LinkableCollectionSlug,
  NavigationLinkEventValue,
  NonEmptyReadonlyArray,
} from '#links.registry.ts'

export function createNavigationLinkEventsSchema<TEvent extends string = NavigationLinkEventValue>(options: {
  events?: NonEmptyReadonlyArray<TEvent>
} = {}): z.ZodType<TEvent> {
  if (options.events == null) {
    return z.string() as unknown as z.ZodType<TEvent>
  }

  return z.enum(options.events) as z.ZodType<TEvent>
}

export type NavigationLinkEvent<TEvent extends string = NavigationLinkEventValue> = TEvent

export const baseClientNavigationLinkSchema = z.object({
  label: z.string(),
})

export interface BaseClientNavigationLink {
  label: string
}

export interface ClientNavigationLinkRelation<TRelationTo extends string = LinkableCollectionSlug>
  extends BaseClientNavigationLink {
  link: ClientLink<TRelationTo>
  navType: 'link'
}

export interface ClientNavigationLinkWithCategories<TRelationTo extends string = LinkableCollectionSlug>
  extends BaseClientNavigationLink {
  categories: ClientNavigationLinkRelation<TRelationTo>[]
  link: ClientLink<TRelationTo>
  navType: 'linkWithDropdown'
}

export interface ClientNavigationEvent<TEvent extends string = NavigationLinkEventValue>
  extends BaseClientNavigationLink {
  event: TEvent
  navType: 'event'
}

export type ClientNavigationDropdownLink<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> = ClientNavigationEvent<TEvent> | ClientNavigationLinkRelation<TRelationTo>

export interface ClientNavigationDropdown<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
> extends BaseClientNavigationLink {
  links: ClientNavigationDropdownLink<TRelationTo, TEvent>[]
  navType: 'dropdown'
}

export type ClientNavigationLink<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>
  = | ClientNavigationDropdown<TRelationTo, TEvent>
    | ClientNavigationEvent<TEvent>
    | ClientNavigationLinkRelation<TRelationTo>

export function createClientNavigationLinkRelationSchema<TRelationTo extends string = LinkableCollectionSlug>(options: {
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientNavigationLinkRelation<TRelationTo>> {
  return baseClientNavigationLinkSchema.extend({
    label: z.string(),
    link: createClientLinkSchema(options),
    navType: z.literal('link'),
  }) as z.ZodType<ClientNavigationLinkRelation<TRelationTo>>
}

export function createClientNavigationLinkWithCategoriesSchema<
  TRelationTo extends string = LinkableCollectionSlug>(options: {
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientNavigationLinkWithCategories<TRelationTo>> {
  const clientNavigationLinkRelationSchema = createClientNavigationLinkRelationSchema(options)

  return baseClientNavigationLinkSchema.extend({
    categories: clientNavigationLinkRelationSchema.array(),
    label: z.string(),
    link: createClientLinkSchema(options),
    navType: z.literal('linkWithDropdown'),
  }) as z.ZodType<ClientNavigationLinkWithCategories<TRelationTo>>
}

export function createClientNavigationEventSchema<TEvent extends string = NavigationLinkEventValue>(options: {
  events?: NonEmptyReadonlyArray<TEvent>
} = {}): z.ZodType<ClientNavigationEvent<TEvent>> {
  return baseClientNavigationLinkSchema.extend({
    event: createNavigationLinkEventsSchema(options),
    label: z.string(),
    navType: z.literal('event'),
  }) as z.ZodType<ClientNavigationEvent<TEvent>>
}

export function createClientNavigationDropdownLinkSchema<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>(options: {
  events?: NonEmptyReadonlyArray<TEvent>
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientNavigationDropdownLink<TRelationTo, TEvent>> {
  return createClientNavigationLinkRelationSchema(options).or(
    createClientNavigationEventSchema(options),
  ) as z.ZodType<ClientNavigationDropdownLink<TRelationTo, TEvent>>
}

export function createClientNavigationDropdownSchema<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>(options: {
  events?: NonEmptyReadonlyArray<TEvent>
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientNavigationDropdown<TRelationTo, TEvent>> {
  return baseClientNavigationLinkSchema.extend({
    label: z.string(),
    links: z.array(createClientNavigationDropdownLinkSchema(options)),
    navType: z.literal('dropdown'),
  }) as z.ZodType<ClientNavigationDropdown<TRelationTo, TEvent>>
}

export function createClientNavigationLinkSchema<
  TRelationTo extends string = LinkableCollectionSlug,
  TEvent extends string = NavigationLinkEventValue,
>(options: {
  events?: NonEmptyReadonlyArray<TEvent>
  relationTo?: NonEmptyReadonlyArray<TRelationTo>
} = {}): z.ZodType<ClientNavigationLink<TRelationTo, TEvent>> {
  return z.union([
    createClientNavigationLinkRelationSchema(options),
    createClientNavigationEventSchema(options),
    createClientNavigationDropdownSchema(options),
  ]) as z.ZodType<ClientNavigationLink<TRelationTo, TEvent>>
}

export const navigationLinkEventsSchema = createNavigationLinkEventsSchema()
export const clientNavigationLinkRelationSchema = createClientNavigationLinkRelationSchema()
export const clientNavigationLinkWithCategoriesSchema = createClientNavigationLinkWithCategoriesSchema()
export const clientNavigationEventSchema = createClientNavigationEventSchema()
export const clientNavigationDropdownLinkSchema = createClientNavigationDropdownLinkSchema()
export const clientNavigationDropdownSchema = createClientNavigationDropdownSchema()
export const clientNavigationLinkSchema = createClientNavigationLinkSchema()
