
import type {
  CollectionSlug,
  Field,
  TypedLocale,
  Where,
  Payload as BasePayload,
} from 'payload'

export interface PayloadUtilsRegistry {
  Payload: BasePayload
}

export type PayloadUtilsPayload = PayloadUtilsRegistry['Payload']
export type GetPayload = () => Promise<PayloadUtilsPayload>
export type GetTenantQuery = (tenantId: string | null | undefined) => Where
export type PayloadLocale = TypedLocale
export interface GetRichTextFieldOptions {
  enabledCollections?: CollectionSlug[]
  label: string
  localized?: boolean
  name: string
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
