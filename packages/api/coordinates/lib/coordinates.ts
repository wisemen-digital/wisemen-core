import { Distance, DistanceUnit } from '@wisemen/quantity'
import { isLatLong, isObject } from 'class-validator'
import { Point } from 'typeorm'
import wkx from 'wkx'

export class Coordinates {
  public readonly latitude: number
  public readonly longitude: number

  constructor (point: Point)
  constructor (hexWkb: string)
  constructor (pointOrHexWkb: string | Point)
  constructor (latitude: number, longitude: number)
  constructor (pointOrLatitude: Point | string | number, longitude?: number) {
    let latitude: number

    if (isObject(pointOrLatitude)) {
      latitude = pointOrLatitude.coordinates[1]
      longitude = pointOrLatitude.coordinates[0]
    } else if (typeof pointOrLatitude === 'string') {
      const geometry = wkx.Geometry.parse(Buffer.from(pointOrLatitude, 'hex'))
      const geojson = geometry.toGeoJSON() as { type: string, coordinates: [number, number] }

      if (geojson.type !== 'Point') {
        throw new Error('invalid coordinate arguments: provided string is not a point')
      }

      latitude = geojson.coordinates[1]
      longitude = geojson.coordinates[0]
    } else {
      latitude = pointOrLatitude
      longitude = longitude as number
    }

    if (!isLatLong(`${latitude},${longitude}`)) {
      throw new Error(`${latitude},${longitude} are not valid coordinates`)
    }

    this.latitude = latitude
    this.longitude = longitude
  }

  /**
   * Calculates the haversine distance
   * @see https://www.movable-type.co.uk/scripts/latlong.html
   * @see https://en.wikipedia.org/wiki/Haversine_formula
  */
  distance (to: Coordinates): Distance {
    const φ1 = this.toRadial(this.latitude)
    const φ2 = this.toRadial(to.latitude)

    const R = 6371e3 // earth radius in m
    const Δφ = this.toRadial(to.latitude - this.latitude)
    const Δλ = this.toRadial(to.longitude - this.longitude)
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
      + Math.cos(φ1) * Math.cos(φ2)
      * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c

    return new Distance(d, DistanceUnit.METER)
  }

  toPoint (): Point {
    return {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    }
  }

  equals (other: Coordinates): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude
  }

  hash (): string {
    return `${this.latitude};${this.longitude}`
  }

  private toRadial (degree: number): number {
    return degree * (Math.PI / 180)
  }
}
