import { useDataFormatConfig } from '@/composables/config.composable'

export function useNumberFormat() {
  const {
    locale,
  } = useDataFormatConfig()

  /**
   * Format a number with locale-aware grouping and decimal separators.
   * E.g., format(1234.5, 2) → "1,234.50" (en) or "1.234,50" (nl).
   */
  function format(value: number, precision = 0): string {
    return new Intl.NumberFormat(locale.value, {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(value)
  }

  /**
   * Format a number as a percentage.
   * The value should be a fraction (e.g. 0.125 for 12.5%).
   * E.g., toPercent(0.125) → "12.5%" (en) or "12,5%" (nl).
   */
  function toPercent(value: number, precision = 0): string {
    return new Intl.NumberFormat(locale.value, {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
      style: 'percent',
    }).format(value)
  }

  /**
   * Format a number in compact notation.
   * E.g., toCompact(1_200_000) → "1.2M" (en) or "1,2 mln." (nl).
   */
  function toCompact(value: number): string {
    return new Intl.NumberFormat(locale.value, {
      compactDisplay: 'short',
      notation: 'compact',
    }).format(value)
  }

  /**
   * Format bytes as a human-readable file size.
   * E.g., toFileSize(1536) → "1.5 kB", toFileSize(1_048_576) → "1 MB".
   */
  function toFileSize(bytes: number): string {
    const units = [
      'B',
      'kB',
      'MB',
      'GB',
      'TB',
    ] as const

    if (bytes === 0) {
      return `0 ${units[0]}`
    }

    const k = 1024
    const exponent = Math.min(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(k)),
      units.length - 1,
    )
    const value = bytes / (k ** exponent)
    const precision = value % 1 === 0 ? 0 : 1

    return `${format(value, precision)} ${units[exponent]}`
  }

  /**
   * Format a number range with locale-aware separators.
   * E.g., toRange(1000, 2000) → "1,000 – 2,000" (en) or "1.000 – 2.000" (nl).
   */
  function toRange(start: number, end: number, precision = 0): string {
    return `${format(start, precision)} – ${format(end, precision)}`
  }

  return {
    format,
    toCompact,
    toFileSize,
    toPercent,
    toRange,
  }
}
