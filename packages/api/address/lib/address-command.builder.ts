import { CoordinatesCommand } from '@wisemen/coordinates'
import { AddressCommand } from './address-command.js'

export class AddressCommandBuilder {
  private command: AddressCommand

  constructor () {
    this.command = new AddressCommand()
    this.command.placeId = null
    this.command.placeName = null
    this.command.country = null
    this.command.countryCode = null
    this.command.city = null
    this.command.postalCode = null
    this.command.streetName = null
    this.command.streetNumber = null
    this.command.unit = null
    this.command.coordinates = null
  }

  withPlaceId (placeId: string | null): this {
    this.command.placeId = placeId

    return this
  }

  withPlaceName (placeName: string | null): this {
    this.command.placeName = placeName

    return this
  }

  withCountry (country: string | null): this {
    this.command.country = country

    return this
  }

  withCountryCode (countryCode: string | null): this {
    this.command.countryCode = countryCode

    return this
  }

  withCity (city: string | null): this {
    this.command.city = city

    return this
  }

  withPostalCode (postalCode: string | null): this {
    this.command.postalCode = postalCode

    return this
  }

  withStreetName (streetName: string | null): this {
    this.command.streetName = streetName

    return this
  }

  withStreetNumber (streetNumber: string | null): this {
    this.command.streetNumber = streetNumber

    return this
  }

  withUnit (unit: string | null): this {
    this.command.unit = unit

    return this
  }

  withCoordinates (coordinates: CoordinatesCommand | null): this {
    this.command.coordinates = coordinates

    return this
  }

  build (): AddressCommand {
    return this.command
  }
}
