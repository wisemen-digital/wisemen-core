import type { PayloadLocale } from '#payloadUtils.types.ts'
import type { PayloadUtilsMethodName } from '#payloadUtils.types.ts'

export function createPayloadUtilsError(methodName: PayloadUtilsMethodName) {
  return new Error(
    `@repo/payload-utils was used before initialization. Call initializePayloadUtils(...) in your CMS app before calling ${methodName}().`,
  )
}

export function createPayloadUtilsInitializationError() {
  return new Error(
    '@repo/payload-utils was used before initialization. Call initializePayloadUtils(...) in your CMS app once during startup.',
  )
}

export function createPayloadUtilsInvalidLocalesError() {
  return new Error(
    '@repo/payload-utils requires at least one configured locale. Pass a non-empty locales array to initializePayloadUtils(...).',
  )
}

export function createPayloadUtilsInvalidFallbackLocaleError(fallbackLocale: PayloadLocale) {
  return new Error(
    `@repo/payload-utils received fallbackLocale "${fallbackLocale}" but it is not present in the configured locales array.`,
  )
}
