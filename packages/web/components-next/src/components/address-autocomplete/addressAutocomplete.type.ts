export type AddressComponentType = 'country' | 'locality' | 'postal_code' | 'route' | 'street_number' | 'subpremise'

export interface FormattedAddress {
  placeId: string
  mainText: string
  secondaryText: string
}

export interface Address {
  placeId?: string | null
  bus: string
  city: string
  coordinates: {
    lat: number | null
    lng: number | null
  }
  country: string
  postalCode: string
  street: string
  streetNumber: string
}
