import type {
  Address,
  AddressComponentType,
  FormattedAddress,
} from '@/components/address-autocomplete/addressAutocomplete.type'

function findAddressComponent(
  addressComponents: google.maps.places.AddressComponent[],
  type: AddressComponentType,
): google.maps.places.AddressComponent | null {
  return addressComponents.find((component) => component.types[0] === type) ?? null
}

export async function getAddressByPlaceId(placeId: string): Promise<Address> {
  const place = new google.maps.places.Place({
    id: placeId,
  })

  await place.fetchFields({
    fields: [
      'addressComponents',
      'location',
    ],
  })

  const lat = place.location?.lat() ?? null
  const lng = place.location?.lng() ?? null

  return {
    placeId: place.id ?? null,
    bus: findAddressComponent(place.addressComponents ?? [], 'subpremise')?.longText ?? '',
    city: findAddressComponent(place.addressComponents ?? [], 'locality')?.longText ?? '',
    coordinates: {
      lat,
      lng,
    },
    country: findAddressComponent(place.addressComponents ?? [], 'country')?.shortText ?? '',
    postalCode: findAddressComponent(place.addressComponents ?? [], 'postal_code')?.longText ?? '',
    street: findAddressComponent(place.addressComponents ?? [], 'route')?.longText ?? '',
    streetNumber: findAddressComponent(place.addressComponents ?? [], 'street_number')?.longText ?? '',
  }
}

export function addressToFormattedAddress(address: Address): FormattedAddress {
  const mainTextParts = []
  const secondaryTextParts = []

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
  const parts = []

  if (formattedAddress.mainText !== '') {
    parts.push(formattedAddress.mainText)
  }

  if (formattedAddress.secondaryText !== '') {
    parts.push(formattedAddress.secondaryText)
  }

  return parts.join(', ')
}
