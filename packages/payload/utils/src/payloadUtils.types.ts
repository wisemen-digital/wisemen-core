import type {
  CollectionSlug,
  Field,
  Payload as BasePayload,
  SelectField,
  StaticLabel,
  TypedLocale,
  Where,
} from 'payload'

export interface PayloadUtilsRegistry {
  Payload: BasePayload
}

export type PayloadUtilsPayload = PayloadUtilsRegistry['Payload']
export type GetPayload = () => Promise<PayloadUtilsPayload>
export type GetTenantQuery = (tenantId: string | null | undefined) => Where
export type PayloadLocale = TypedLocale
export type PayloadLabel = SelectField['options'] extends Array<infer TOption>
  ? TOption extends {
    label: infer TLabel
  }
    ? TLabel
    : string
  : string

export interface PayloadEventOption {
  id: string
  label: PayloadLabel
}

export interface GetRichTextFieldOptions {
  name: string
  enabledCollections?: CollectionSlug[]
  label: StaticLabel
  localized?: boolean
  required?: boolean
}
export type GetSimpleRichTextField = (options: GetRichTextFieldOptions) => Field

export interface PayloadUtilsConfig {
  defaultEvents?: PayloadEventOption[]
  defaultLinkableCollections?: CollectionSlug[]
  fallbackLocale: PayloadLocale
  getPayload?: GetPayload
  getSimpleRichTextField: GetSimpleRichTextField
  getTenantQuery: GetTenantQuery
  locales: PayloadLocale[]
}

export type PayloadUtilsMethodName = keyof PayloadUtilsConfig
