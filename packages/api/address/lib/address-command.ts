import { IsISO31661Alpha2, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNullable } from '@wisemen/validators'
import { CoordinatesCommand } from '@wisemen/coordinates'
import { AddressBuilder } from './address.builder.js'
import { Address } from './address.js'

export class AddressCommand {
  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  placeName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  placeId: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  country: string | null

  @ApiProperty({ type: 'string', nullable: true, example: 'US', description: 'The ISO 3166-1 alpha-2 country code', required: false })
  @IsISO31661Alpha2()
  @IsOptional()
  countryCode?: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  city: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  postalCode: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  streetName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  streetNumber: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  unit: string | null

  @ApiProperty({ type: CoordinatesCommand, nullable: true })
  @IsNullable()
  @IsObject()
  @Type(() => CoordinatesCommand)
  @ValidateNested()
  coordinates: CoordinatesCommand | null

  parse (): Address {
    return new AddressBuilder()
      .withPlaceId(this.placeId)
      .withPlaceName(this.placeName)
      .withCountry(this.country)
      .withCountryCode(this.countryCode)
      .withCity(this.city)
      .withPostalCode(this.postalCode)
      .withStreetName(this.streetName)
      .withStreetNumber(this.streetNumber)
      .withUnit(this.unit)
      .withCoordinates(this.coordinates ? this.coordinates.toCoordinates() : null)
      .build()
  }
}
