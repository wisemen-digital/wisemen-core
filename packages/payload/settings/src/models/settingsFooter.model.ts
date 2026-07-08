import {
  clientLinkSchema,
  navigationLinkEventsSchema,
} from '@wisemen/payload-core-links'
import { z } from 'zod'

export const clientFooterLinkVariantSchema = z.enum([
  'default',
  'highlighted',
])

export const clientSettingsFooterLinkLinkSchema = z.object({
  label: z.string(),
  link: clientLinkSchema,
  navType: z.literal('link'),
  variant: clientFooterLinkVariantSchema,
})

export const clientSettingsFooterEventLinkSchema = z.object({
  event: navigationLinkEventsSchema,
  label: z.string(),
  navType: z.literal('event'),
  variant: clientFooterLinkVariantSchema,
})

export const clientSettingsFooterLinkSchema = z.discriminatedUnion('navType', [
  clientSettingsFooterLinkLinkSchema,
  clientSettingsFooterEventLinkSchema,
])

export const clientSettingsFooterSectionSchema = z.object({
  title: z.string().nullable(),
  link: clientLinkSchema.nullable(),
  links: z.array(clientSettingsFooterLinkSchema),
})

export const clientSettingsFooterSchema = z.array(clientSettingsFooterSectionSchema)
export type ClientSettingsFooter = z.infer<typeof clientSettingsFooterSchema>
export type ClientSettingsFooterLink = z.infer<typeof clientSettingsFooterLinkSchema>
export type ClientSettingsFooterLinkVariant = z.infer<typeof clientFooterLinkVariantSchema>
export type ClientSettingsFooterSection = z.infer<typeof clientSettingsFooterSectionSchema>
