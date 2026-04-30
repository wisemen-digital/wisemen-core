import * as allFlags from 'country-flag-icons/string/3x2'
import type { CountryCode } from 'libphonenumber-js'

export function getCountryFlagSvg(countryCode: CountryCode): string | null {
  return (allFlags as Record<string, string>)[countryCode] ?? null
}

export function getCountryName(countryCode: CountryCode, locale: string): string | null {
  return new Intl.DisplayNames(locale, {
    type: 'region',
  }).of(countryCode) ?? null
}
