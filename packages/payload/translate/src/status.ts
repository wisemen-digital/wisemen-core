export const TRANSLATION_STATUS_FIELD_NAME = 'translationStatus'

export const TRANSLATION_STATUSES = {
  manuallyEdited: 'manually_edited',
  notTranslated: 'not_translated',
  staleTranslation: 'stale_translation',
  translated: 'translated',
} as const

export const TRANSLATION_MODES = {
  retranslate: 'retranslate',
  translate: 'translate',
} as const

export type TranslationStatus = typeof TRANSLATION_STATUSES[keyof typeof TRANSLATION_STATUSES]
export type TranslationMode = typeof TRANSLATION_MODES[keyof typeof TRANSLATION_MODES]

export const TRANSLATION_STATUS_LABELS: Record<TranslationStatus, string> = {
  [TRANSLATION_STATUSES.manuallyEdited]: 'Manually edited',
  [TRANSLATION_STATUSES.notTranslated]: 'Not translated',
  [TRANSLATION_STATUSES.staleTranslation]: 'Stale translation',
  [TRANSLATION_STATUSES.translated]: 'Automatically translated',
}

export const TRANSLATION_MODE_LABELS: Record<TranslationMode, string> = {
  [TRANSLATION_MODES.retranslate]: 'Retranslate',
  [TRANSLATION_MODES.translate]: 'Translate',
}

export function isTranslationStatus(value: unknown): value is TranslationStatus {
  return typeof value === 'string' && Object.values(TRANSLATION_STATUSES).includes(value as TranslationStatus)
}

export function isTranslationMode(value: unknown): value is TranslationMode {
  return typeof value === 'string' && Object.values(TRANSLATION_MODES).includes(value as TranslationMode)
}

export function normalizeTranslationStatus(value: unknown | null): TranslationStatus {
  if (isTranslationStatus(value)) {
    return value
  }

  return TRANSLATION_STATUSES.notTranslated
}

export function resolveTranslationStatusMap(
  value: unknown,
  locales: string[],
): Record<string, TranslationStatus> {
  const source = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {}

  return Object.fromEntries(locales.map((locale) => [
    locale,
    resolveTranslationStatus(source[locale]),
  ]))
}

export function canTranslateStatus(status: TranslationStatus): boolean {
  return status === TRANSLATION_STATUSES.notTranslated || status === TRANSLATION_STATUSES.staleTranslation
}

export function resolveTranslationStatus(value: unknown): TranslationStatus {
  if (isTranslationStatus(value)) {
    return value
  }

  return TRANSLATION_STATUSES.notTranslated
}
