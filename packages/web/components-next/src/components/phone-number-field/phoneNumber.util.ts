import type { CountryCode } from 'libphonenumber-js'

export function getCountryFlagUrl(countryCode: CountryCode): string | null {
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`
}

export function getCountryName(countryCode: CountryCode, locale: string): string | null {
  return new Intl.DisplayNames(locale, {
    type: 'region',
  }).of(countryCode) ?? countryCode
}
