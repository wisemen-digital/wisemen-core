import { Coordinates } from '@wisemen/coordinates'

export class Address {
  placeName?: string | null
  placeId?: string | null
  country?: string | null
  countryCode?: string | null
  city?: string | null
  postalCode?: string | null
  streetName?: string | null
  streetNumber?: string | null
  unit?: string | null
  coordinates?: Coordinates | null
}
