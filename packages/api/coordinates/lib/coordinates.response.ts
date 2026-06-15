import { ApiProperty } from '@nestjs/swagger'
import { Coordinates } from './coordinates.js'

export class CoordinatesResponse {
  static from (coordinates: Coordinates): CoordinatesResponse
  static from (coordinates: null): null
  static from (coordinates: Coordinates | null): CoordinatesResponse | null {
    return coordinates !== null ? new CoordinatesResponse(coordinates) : null
  }

  @ApiProperty({ type: Number })
  longitude: number

  @ApiProperty({ type: Number })
  latitude: number

  constructor (coordinates: Coordinates) {
    this.longitude = coordinates.longitude
    this.latitude = coordinates.latitude
  }
}
