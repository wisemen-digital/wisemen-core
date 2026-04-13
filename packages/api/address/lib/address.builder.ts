import { Coordinates } from '@wisemen/coordinates'
import { Address } from './address.js'

export class AddressBuilder {
  private readonly address: Address

  constructor () {
    this.address = new Address()
    this.address.placeId = null
    this.address.placeName = null
    this.address.country = null
    this.address.countryCode = null
    this.address.city = null
    this.address.postalCode = null
    this.address.streetName = null
    this.address.streetNumber = null
    this.address.unit = null
    this.address.coordinates = null
  }

  withPlaceName (name?: string | null): this {
    this.address.placeName = name ?? null

    return this
  }

  withPlaceId (id?: string | null): this {
    this.address.placeId = id ?? null

    return this
  }

  withCountry (country?: string | null): this {
    this.address.country = country ?? null

    return this
  }

  withCountryCode (countryCode?: string | null): this {
    this.address.countryCode = countryCode ?? null

    return this
  }

  withCity (city?: string | null): this {
    this.address.city = city ?? null

    return this
  }

  withPostalCode (zipCode?: string | null): this {
    this.address.postalCode = zipCode ?? null

    return this
  }

  withStreetName (streetName?: string | null): this {
    this.address.streetName = streetName ?? null

    return this
  }

  withStreetNumber (streetNumber?: string | null): this {
    this.address.streetNumber = streetNumber ?? null

    return this
  }

  withUnit (unit?: string | null): this {
    this.address.unit = unit ?? null

    return this
  }

  withCoordinates (coordinates?: Coordinates | null): this {
    this.address.coordinates = coordinates ?? null

    return this
  }

  build (): Address {
    return this.address
  }
}
