import { ApiProperty } from '@nestjs/swagger'
import { CoordinatesResponse } from '@wisemen/coordinates'
import { Address } from './address.js'

export class AddressResponse {
  static from (address: Address): AddressResponse
  static from (address: null): null
  static from (address: Address | null): AddressResponse | null
  static from (address: Address | null): AddressResponse | null {
    return address !== null ? new AddressResponse(address) : null
  }

  @ApiProperty({ type: 'string', nullable: true })
  placeName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  placeId: string | null

  @ApiProperty({ type: 'string', nullable: true })
  country: string | null

  @ApiProperty({ type: 'string', nullable: true })
  countryCode: string | null

  @ApiProperty({ type: 'string', nullable: true })
  city: string | null

  @ApiProperty({ type: 'string', nullable: true })
  postalCode: string | null

  @ApiProperty({ type: 'string', nullable: true })
  streetName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  streetNumber: string | null

  @ApiProperty({ type: 'string', nullable: true })
  unit: string | null

  @ApiProperty({ type: CoordinatesResponse, nullable: true })
  coordinates: CoordinatesResponse | null

  constructor (address: Address) {
    this.placeName = address.placeName ?? null
    this.placeId = address.placeId ?? null
    this.country = address.country ?? null
    this.countryCode = address.countryCode ?? null
    this.city = address.city ?? null
    this.postalCode = address.postalCode ?? null
    this.streetName = address.streetName ?? null
    this.streetNumber = address.streetNumber ?? null
    this.unit = address.unit ?? null
    this.coordinates = CoordinatesResponse.from(address.coordinates ?? null)
  }
}
