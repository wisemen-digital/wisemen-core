import type {
  HeaderNavigationRowDocument,
  LinkFieldDocument,
} from '@wisemen/payload-core-links'
import type { TypedLocale } from 'payload'

export interface SettingsQueryContext {
  tenantId: string | null
  locale: TypedLocale
}

export interface SettingsGeneralDocument {
  adminEmail?: string | null
}

export interface SettingsContactDocument {
  email?: string | null
  phone?: string | null
  whatsappLink?: string | null
}

export interface SettingsHeaderDocument {
  links?: HeaderNavigationRowDocument[] | null
  subheaderLinks?: HeaderNavigationRowDocument[] | null
}

export interface SettingsHomePageDocument {
  homePage?: LinkFieldDocument | null
}

export interface FooterSectionLinkDocument {
  event?: string | null
  label?: string | null
  link?: LinkFieldDocument | null
  navType?: 'event' | 'link' | null
  variant?: 'default' | 'highlighted' | null
}

export interface FooterSectionDocument {
  title?: string | null
  link?: LinkFieldDocument | null
  links?: FooterSectionLinkDocument[] | null
}

export interface SettingsFooterDocument {
  sections?: FooterSectionDocument[] | null
}

export interface SettingsSocialsDocument {
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  pinterest?: string | null
  tiktok?: string | null
  youtube?: string | null
}

export interface SettingsDocument {
  // Legacy flat fields are kept for compatibility with existing records.
  adminEmail?: string | null
  contact?: SettingsContactDocument | null
  email?: string | null
  facebook?: string | null
  footer?: SettingsFooterDocument | null
  general?: SettingsGeneralDocument | null

  header?: SettingsHeaderDocument | null
  homepage?: SettingsHomePageDocument | null
  homePage?: LinkFieldDocument | null
  instagram?: string | null
  linkedin?: string | null
  links?: HeaderNavigationRowDocument[] | null
  phone?: string | null
  pinterest?: string | null
  sections?: FooterSectionDocument[] | null
  socials?: SettingsSocialsDocument | null
  subheaderLinks?: HeaderNavigationRowDocument[] | null
  tiktok?: string | null
  whatsappLink?: string | null
  youtube?: string | null
}
