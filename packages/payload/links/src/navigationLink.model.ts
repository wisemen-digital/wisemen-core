import { z } from 'zod'

import { clientLinkSchema } from '#link.model.ts'

export const NAVIGATION_LINK_EVENTS = [] as const

export const navigationLinkEventsSchema = z.string()
export type NavigationLinkEvent = z.infer<typeof navigationLinkEventsSchema>

export const baseClientNavigationLinkSchema = z.object({
  label: z.string(),
})

export const clientNavigationLinkRelationSchema = baseClientNavigationLinkSchema.extend({
  label: z.string(),
  link: clientLinkSchema,
  navType: z.literal('link'),
})

export const clientNavigationLinkWithCategoriesSchema = baseClientNavigationLinkSchema.extend({
  categories: clientNavigationLinkRelationSchema.array(),
  label: z.string(),
  link: clientLinkSchema,
  navType: z.literal('linkWithDropdown'),
})

export const clientNavigationEventSchema = baseClientNavigationLinkSchema.extend({
  event: navigationLinkEventsSchema,
  label: z.string(),
  navType: z.literal('event'),
})

export const clientNavigationDropdownLinkSchema = clientNavigationLinkRelationSchema.or(clientNavigationEventSchema)

export const clientNavigationDropdownSchema = baseClientNavigationLinkSchema.extend({
  label: z.string(),
  links: z.array(clientNavigationDropdownLinkSchema),
  navType: z.literal('dropdown'),
})

export const clientNavigationLinkSchema = z.discriminatedUnion('navType', [
  clientNavigationLinkRelationSchema,
  clientNavigationEventSchema,
  clientNavigationDropdownSchema,
])

export type ClientNavigationDropdown = z.infer<typeof clientNavigationDropdownSchema>
export type ClientNavigationDropdownLink = z.infer<typeof clientNavigationDropdownLinkSchema>
export type ClientNavigationEvent = z.infer<typeof clientNavigationEventSchema>
export type ClientNavigationLink = z.infer<typeof clientNavigationLinkSchema>
export type ClientNavigationLinkRelation = z.infer<typeof clientNavigationLinkRelationSchema>
export type ClientNavigationLinkWithCategories = z.infer<typeof clientNavigationLinkWithCategoriesSchema>
