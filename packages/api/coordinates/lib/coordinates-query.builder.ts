import { CoordinatesQuery } from './coordinates.query.js'

export class CoordinatesQueryBuilder {
  private readonly query: CoordinatesQuery

  constructor () {
    this.query = new CoordinatesQuery()
  }

  withLatitude (latitude: number | string): this {
    this.query.latitude = latitude.toString()

    return this
  }

  withLongitude (longitude: number | string): this {
    this.query.longitude = longitude.toString()

    return this
  }

  build (): CoordinatesQuery {
    return this.query
  }
}
