import type { Where } from 'payload'

import {
  createPayloadUtilsError,
  createPayloadUtilsInvalidFallbackLocaleError,
  createPayloadUtilsInvalidLocalesError,
  createPayloadUtilsInitializationError,
} from '#payloadUtils.errors.ts'
import {
  readPayloadUtilsConfig,
  setPayloadUtilsConfig,
} from '#payloadUtils.state.ts'
import type {
  GetRichTextFieldOptions,
  PayloadLocale,
  PayloadUtilsPayload,
  PayloadUtilsConfig,
} from '#payloadUtils.types.ts'

export type {
  GetPayload,
  GetRichTextFieldOptions,
  GetSimpleRichTextField,
  GetTenantQuery,
  PayloadLocale,
  PayloadUtilsPayload,
  PayloadUtilsConfig,
} from '#payloadUtils.types.ts'

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

export function getPayloadUtils(): PayloadUtilsConfig {
  const payloadUtilsConfig = readPayloadUtilsConfig()

  if (payloadUtilsConfig == null) {
    throw createPayloadUtilsInitializationError()
  }

  return payloadUtilsConfig
}
