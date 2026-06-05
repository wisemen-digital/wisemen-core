/**
 * Controls which character pair is used as the thousands and decimal separator
 * in NumberField components.
 *
 * - `period-comma`  → 1.234.567,89  (e.g. de-DE)
 * - `comma-period`  → 1,234,567.89  (e.g. en-US)
 * - `space-period`  → 1 234 567.89  (e.g. fr-CH)
 * - `space-comma`   → 1 234 567,89  (e.g. fr-FR)
 * - `system`        → follows the browser / OS locale
 */
export type NumberFormat = 'comma-period' | 'period-comma' | 'space-comma' | 'space-period' | 'system'

const numberFormatLocaleMap = {
  'comma-period': 'en-US',
  'period-comma': 'de-DE',
  'space-comma': 'fr-FR',
  'space-period': 'fr-CH',
} as const satisfies Record<Exclude<NumberFormat, 'system'>, string>

export function getLocaleFromNumberFormat(format: NumberFormat): string {
  if (format === 'system') {
    return navigator.language
  }

  return numberFormatLocaleMap[format]
}
