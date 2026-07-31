import { Injectable } from '@nestjs/common'
import type { Coordinates } from '@wisemen/coordinates'
import { OsrmClient } from './osrm.client.js'
import type { MockOsrmClientOptions } from './osrm.module-options.js'
import type { OsrmRouteResponse, OsrmRoute, OsrmTableQueryOptions, OsrmTableResponse, OsrmTileResponse } from './osrm.types.js'

@Injectable()
export class MockOsrmClient implements OsrmClient {
  private readonly averageSpeedKph: number

  constructor (options: MockOsrmClientOptions = { type: 'mock' }) {
    this.averageSpeedKph = options.averageSpeedKph ?? 50
  }

  async calculateMultiLegRoute (
    points: Coordinates[]
  ): Promise<OsrmRouteResponse> {
    const legs = this.buildLegs(points)
    const distance = legs.reduce((total, leg) => total + leg.distance, 0)
    const duration = legs.reduce((total, leg) => total + leg.duration, 0)

    return {
      routes: [{
        distance,
        duration,
        geometry: {
          coordinates: points.map(point => [point.longitude, point.latitude])
        },
        legs
      }]
    }
  }

  async calculateRoute (
    from: Coordinates,
    to: Coordinates
  ): Promise<OsrmRoute> {
    const response = await this.calculateMultiLegRoute([from, to])

    return response.routes[0]
  }

  async calculateTable (
    coordinates: Coordinates[],
    options: OsrmTableQueryOptions = {}
  ): Promise<OsrmTableResponse> {
    const sourceIndices = options.sources ?? coordinates.map((_, index) => index)
    const destinationIndices = options.destinations ?? coordinates.map((_, index) => index)

    const durations = sourceIndices.map(sourceIndex => {
      return destinationIndices.map(destinationIndex => {
        return this.calculateDuration(
          coordinates[sourceIndex],
          coordinates[destinationIndex]
        )
      })
    })

    const distances = sourceIndices.map(sourceIndex => {
      return destinationIndices.map(destinationIndex => {
        return coordinates[sourceIndex].distance(coordinates[destinationIndex]).meters
      })
    })

    return {
      code: 'Ok',
      durations,
      distances,
      sources: sourceIndices.map(index => this.createWaypoint(coordinates[index])),
      destinations: destinationIndices.map(index => this.createWaypoint(coordinates[index]))
    }
  }

  async calculateTile (
    from: Coordinates,
    destinations: Coordinates[]
  ): Promise<OsrmTileResponse> {
    const response = await this.calculateTable([from, ...destinations], {
      sources: [0],
      destinations: destinations.map((_, index) => index + 1)
    })

    return {
      durations: response.durations.map(row => row.map(duration => duration ?? 0))
    }
  }

  private buildLegs (points: Coordinates[]): Array<{ distance: number, duration: number }> {
    const legs: Array<{ distance: number, duration: number }> = []

    for (let index = 0; index < points.length - 1; index++) {
      const distance = points[index].distance(points[index + 1]).meters
      const duration = this.calculateDuration(points[index], points[index + 1])

      legs.push({ distance, duration })
    }

    return legs
  }

  private calculateDuration (from: Coordinates, to: Coordinates): number {
    const distanceInMeters = from.distance(to).meters
    const distanceInKm = distanceInMeters / 1000
    const durationInHours = distanceInKm / this.averageSpeedKph

    return durationInHours * 3600
  }

  private createWaypoint (coordinate: Coordinates) {
    return {
      location: [coordinate.longitude, coordinate.latitude] as [number, number],
      name: '',
      distance: 0,
      hint: ''
    }
  }
}
