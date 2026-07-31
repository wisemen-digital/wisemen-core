import type {
  PayloadLocale,
  PayloadUtilsMethodName,
} from '#payloadUtils.types.ts'

export function createPayloadUtilsError(methodName: PayloadUtilsMethodName) {
  return new Error(
    `@wisemen/payload-core-utils was used before initialization. Call initializePayloadUtils(...) in your CMS app before calling ${methodName}().`,
  )
}

export function createPayloadUtilsInitializationError() {
  return new Error(
    '@wisemen/payload-core-utils was used before initialization. Call initializePayloadUtils(...) in your CMS app once during startup.',
  )
}

export function createPayloadUtilsInvalidLocalesError() {
  return new Error(
    '@wisemen/payload-core-utils requires at least one configured locale. Pass a non-empty locales array to initializePayloadUtils(...).',
  )
}

export function createPayloadUtilsInvalidFallbackLocaleError(fallbackLocale: PayloadLocale) {
  return new Error(
    `@wisemen/payload-core-utils received fallbackLocale "${fallbackLocale}" but it is not present in the configured locales array.`,
  )
}
