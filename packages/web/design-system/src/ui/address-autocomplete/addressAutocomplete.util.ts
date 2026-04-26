import type {
  Address,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'

export function addressToFormattedAddress(address: Address): FormattedAddress {
  const mainTextParts: string[] = []
  const secondaryTextParts: string[] = []

  if (address.street !== '') {
    mainTextParts.push(address.street)
  }

  if (address.streetNumber !== '') {
    mainTextParts.push(address.streetNumber)
  }

  if (address.bus !== '') {
    mainTextParts.push(address.bus)
  }

  if (address.postalCode !== '') {
    secondaryTextParts.push(address.postalCode)
  }

  if (address.city !== '') {
    secondaryTextParts.push(address.city)
  }

  return {
    placeId: '',
    mainText: mainTextParts.join(' '),
    secondaryText: secondaryTextParts.join(' '),
  }
}

export function formattedAddressToString(formattedAddress: FormattedAddress): string {
  const parts: string[] = []

  if (formattedAddress.mainText !== '') {
    parts.push(formattedAddress.mainText)
  }

  if (formattedAddress.secondaryText !== '') {
    parts.push(formattedAddress.secondaryText)
  }

  return parts.join(', ')
}
