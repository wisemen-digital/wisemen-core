import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Coordinates, CoordinatesResponse } from '@wisemen/coordinates'
import { AddressBuilder } from '../address.builder.js'
import { AddressResponse } from '../address-response.js'

describe('AddressResponse.from', () => {
  it('returns null when address is null', () => {
    expect(AddressResponse.from(null)).toBeNull()
  })

  it('returns a response when address is provided', () => {
    const address = new AddressBuilder()
      .withPlaceName('Main Office')
      .withPlaceId('place-123')
      .withCountry('Belgium')
      .withCountryCode('BE')
      .withCity('Brussels')
      .withPostalCode('1000')
      .withStreetName('Main Street')
      .withStreetNumber('1')
      .withUnit('A')
      .withCoordinates(new Coordinates(50.8503, 4.3517))
      .build()

    const response = AddressResponse.from(address)

    expect(response).toBeInstanceOf(AddressResponse)
    expect(response?.coordinates).toBeInstanceOf(CoordinatesResponse)
    expect(response).toMatchObject({
      placeName: 'Main Office',
      placeId: 'place-123',
      country: 'Belgium',
      countryCode: 'BE',
      city: 'Brussels',
      postalCode: '1000',
      streetName: 'Main Street',
      streetNumber: '1',
      unit: 'A',
      coordinates: {
        latitude: 50.8503,
        longitude: 4.3517
      }
    })
  })
})
