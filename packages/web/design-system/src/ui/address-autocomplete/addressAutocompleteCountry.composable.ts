import type { Field } from 'formango'
import type { CountryCode } from 'libphonenumber-js/max'
import { getCountries } from 'libphonenumber-js/max'
import { useFilter } from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import {
  getCountryFlagSvgUrl,
  getCountryName,
} from '@/ui/phone-number-field/phoneNumber.util'
import type {
  SelectItem,
  SelectOptionItem,
} from '@/ui/select/select.type'

export function useAddressAutocompleteCountry(
  countryField: Field<string, string | undefined>,
) {
  const configContext = useInjectConfigContext()

  const locale = computed<string>(() => configContext?.locale?.value ?? navigator.language)

  const {
    contains,
  } = useFilter()

  const countrySearch = ref<string>('')

  const countryItems = computed<SelectItem<CountryCode>[]>(() => {
    const search = countrySearch.value.trim()
    const all = getCountries()
    const filtered = search ? all.filter((cc) => matchesCountrySearch(cc, search)) : all

    return filtered.map((cc): SelectOptionItem<CountryCode> => ({
      type: 'option',
      value: cc,
    }))
  })

  const currentCountryCode = computed<CountryCode | null>(() => {
    const stored = countryField.modelValue.value

    if (!stored) {
      return null
    }

    const all = getCountries()

    if (all.includes(stored as CountryCode)) {
      return stored as CountryCode
    }

    return all.find((cc) => getCountryName(cc, locale.value)?.toLowerCase() === stored.toLowerCase()) ?? null
  })

  function matchesCountrySearch(cc: CountryCode, search: string): boolean {
    const name = getCountryName(cc, locale.value) ?? ''
    const term = search.toLowerCase()

    return contains(cc.toLowerCase(), term) || contains(name.toLowerCase(), term)
  }

  function getCountryItemConfig(cc: CountryCode): MenuItemConfig {
    const flagUrl = getCountryFlagSvgUrl(cc)

    return {
      left: flagUrl === null
        ? null
        : {
            aspect: 'rectangle',
            src: flagUrl,
            type: 'image',
          },
    }
  }

  function onCountrySearch(search: string): void {
    countrySearch.value = search
  }

  function displayCountry(cc: CountryCode): string {
    return getCountryName(cc, locale.value) ?? cc
  }

  function onCountrySelect(code: CountryCode | null): void {
    countryField.setValue(code ? (getCountryName(code, locale.value) ?? code) : null)
  }

  return {
    countryItems,
    currentCountryCode,
    displayCountry,
    getCountryItemConfig,
    onCountrySearch,
    onCountrySelect,
  }
}
