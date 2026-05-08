import * as allFlags from 'country-flag-icons/string/3x2'
import type { CountryCode } from 'libphonenumber-js'

export function getCountryFlagSvgUrl(countryCode: CountryCode): string | null {
  const svgString = allFlags[countryCode] ?? null

  if (svgString === null) {
    return null
  }

  return `data:image/svg+xml,${encodeURIComponent(svgString)}`
}

export function getCountryName(countryCode: CountryCode, locale: string): string | null {
  return new Intl.DisplayNames(locale, {
    type: 'region',
  }).of(countryCode) ?? null
}
