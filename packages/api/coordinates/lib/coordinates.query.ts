import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, Matches } from 'class-validator'
import { Coordinates } from './coordinates.js'

export class CoordinatesQuery {
  @ApiProperty({
    type: String,
    example: '5.420593668305642',
    description: 'Longitude coordinate for filtering'
  })
  @Matches(/^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/)
  @IsNumberString()
  longitude: string

  @ApiProperty({
    type: String,
    example: '50.894565509367055',
    description: 'Latitude coordinate for filtering'
  })
  @Matches(/^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/)
  @IsNumberString()
  latitude: string

  toCoordinates (): Coordinates {
    return new Coordinates(parseFloat(this.latitude), parseFloat(this.longitude))
  }
}
