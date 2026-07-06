import type {
  CollectionSlug,
  Field,
  Payload as BasePayload,
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
export interface GetRichTextFieldOptions {
  name: string
  enabledCollections?: CollectionSlug[]
  label: string
  localized?: boolean
  required?: boolean
}
export type GetSimpleRichTextField = (options: GetRichTextFieldOptions) => Field

export interface PayloadUtilsConfig {
  fallbackLocale: PayloadLocale
  getPayload?: GetPayload
  getSimpleRichTextField: GetSimpleRichTextField
  getTenantQuery: GetTenantQuery
  locales: PayloadLocale[]
}

export type PayloadUtilsMethodName = keyof PayloadUtilsConfig
