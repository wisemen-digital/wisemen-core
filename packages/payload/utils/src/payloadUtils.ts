import type {
  CollectionSlug,
  SelectField,
  Where,
} from 'payload'

import {
  createPayloadUtilsError,
  createPayloadUtilsInitializationError,
  createPayloadUtilsInvalidFallbackLocaleError,
  createPayloadUtilsInvalidLocalesError,
} from '#payloadUtils.errors.ts'
import {
  readPayloadUtilsConfig,
  setPayloadUtilsConfig,
} from '#payloadUtils.state.ts'
import type {
  GetRichTextFieldOptions,
  PayloadLocale,
  PayloadUtilsConfig,
  PayloadUtilsPayload,
} from '#payloadUtils.types.ts'

export type {
  GetPayload,
  GetRichTextFieldOptions,
  GetSimpleRichTextField,
  GetTenantQuery,
  PayloadEventOption,
  PayloadLabel,
  PayloadLocale,
  PayloadUtilsConfig,
  PayloadUtilsPayload,
  PayloadUtilsRegistry,
} from '#payloadUtils.types.ts'

const DEFAULT_LINKABLE_COLLECTIONS: CollectionSlug[] = [
  'pages',
  'articles',
]

const DEFAULT_EVENT_OPTIONS: SelectField['options'] = []

export function initializePayloadUtils(config: PayloadUtilsConfig): void {
  if (config.locales.length === 0) {
    throw createPayloadUtilsInvalidLocalesError()
  }

  if (!config.locales.includes(config.fallbackLocale)) {
    throw createPayloadUtilsInvalidFallbackLocaleError(config.fallbackLocale)
  }

  setPayloadUtilsConfig(config)
}

export function getPayload(): Promise<PayloadUtilsPayload> {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null || payloadUtilsConfig.getPayload == null) {
    throw createPayloadUtilsError('getPayload')
  }

  return payloadUtilsConfig.getPayload()
}

export function getTenantQuery(tenantId: string | null | undefined): Where {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsError('getTenantQuery')
  }

  return payloadUtilsConfig.getTenantQuery(tenantId)
}

export function getSimpleRichTextField(options: GetRichTextFieldOptions) {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsError('getSimpleRichTextField')
  }

  return payloadUtilsConfig.getSimpleRichTextField(options)
}

export function getLocales(): PayloadLocale[] {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsError('locales')
  }

  return payloadUtilsConfig.locales
}

export function getFallbackLocale(): PayloadLocale {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsError('fallbackLocale')
  }

  return payloadUtilsConfig.fallbackLocale
}

export function getDefaultLinkableCollections(): CollectionSlug[] {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  return payloadUtilsConfig?.defaultLinkableCollections ?? DEFAULT_LINKABLE_COLLECTIONS
}

export function getDefaultEvents() {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  return payloadUtilsConfig?.defaultEvents ?? []
}

export function getDefaultEventOptions(): SelectField['options'] {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig?.defaultEvents == null) {
    return DEFAULT_EVENT_OPTIONS
  }

  return payloadUtilsConfig.defaultEvents.map((event) => ({
    label: event.label,
    value: event.id,
  }))
}

export function getPayloadUtils(): PayloadUtilsConfig {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsInitializationError()
  }

  return payloadUtilsConfig
}
