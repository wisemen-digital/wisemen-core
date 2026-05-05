import { computed } from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider/config.context'

const NUMBER_SEPARATOR_REGEX = /[\s.,`]/g
const DECIMAL_SEPARATOR_REGEX = /[\s.,`](?=\d+$)/
const SEPARATOR_REGEX = /[.,]/g
const NON_DIGIT_REGEX = /\D/g

const SEPARATOR_STYLE_LOCALE: Record<string, string> = {
  'comma-period': 'en-US',
  'period-comma': 'de-DE',
  'space-comma': 'fr-FR',
  'space-period': 'fr-CH',
}

function parseIntlNumber(value: string, locale: string): number {
  const example = new Intl.NumberFormat(locale).format(12_345.6)
  const group = example.match(NUMBER_SEPARATOR_REGEX)?.[0]
  const decimal = example.match(DECIMAL_SEPARATOR_REGEX)?.[0]

  let normalized = value

  if (group) {
    normalized = normalized.replaceAll(group, '')
  }

  if (decimal) {
    normalized = normalized.replace(decimal, '.')
  }

  return Number(normalized)
}

export function formatNumberDecimalSeparators(value: string, locale: string): number {
  SEPARATOR_REGEX.lastIndex = 0

  const allSeparators = [
    ...value.matchAll(SEPARATOR_REGEX),
  ]

  if (allSeparators.length === 0) {
    return Number(value)
  }

  const separatorChars = allSeparators.map((m) => m[0])
  const uniqueSeps = [
    ...new Set(separatorChars),
  ]

  if (uniqueSeps.length === 2) {
    const decimalSep = separatorChars.at(-1)!
    const thousandsSep = uniqueSeps.find((s) => s !== decimalSep)!

    return Number(value.replaceAll(thousandsSep, '').replace(decimalSep, '.'))
  }

  const sep = uniqueSeps[0]!

  if (allSeparators.length > 1) {
    return Number(value.replaceAll(sep, ''))
  }

  const digitsAfter = value.slice(value.lastIndexOf(sep) + 1).replace(NON_DIGIT_REGEX, '')

  if (digitsAfter.length <= 2) {
    return Number(value.replace(sep, '.'))
  }

  if (digitsAfter.length >= 4) {
    return Number(value.replaceAll(sep, ''))
  }

  return parseIntlNumber(value, locale)
}

export function useNumberFieldLocale() {
  const configContext = useInjectConfigContext(null)

  const effectiveLocale = computed<string>(() => {
    // eslint-disable-next-line better-tailwindcss/no-unknown-classes
    const style = configContext?.numberSeparatorStyle.value ?? 'system'

    if (style === 'system') {
      return navigator.language
    }

    return SEPARATOR_STYLE_LOCALE[style] ?? navigator.language
  })

  return {
    effectiveLocale,
  }
}
