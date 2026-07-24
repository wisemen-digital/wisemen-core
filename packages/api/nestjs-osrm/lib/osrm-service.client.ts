import { Injectable } from '@nestjs/common'
import type { Coordinates } from '@wisemen/coordinates'
import { OsrmClient } from './osrm.client.js'
import type { OsrmRouteResponse, OsrmRoute, OsrmTableQueryOptions, OsrmTableResponse, OsrmTileResponse, OsrmRouteQueryOptions } from './osrm.types.js'
import type { ServiceOsrmClientOptions } from './osrm.module-options.js'

@Injectable()
export class ServiceOsrmClient implements OsrmClient {
  private readonly baseUrl: string
  private readonly profile: string
  private readonly timeout: number

  constructor (options: ServiceOsrmClientOptions) {
    this.baseUrl = options.url.endsWith('/') ? options.url : options.url + '/'
    this.profile = options.profile ?? 'driving'
    this.timeout = options.timeout ?? 30_000
  }

  async calculateMultiLegRoute (
    points: Coordinates[],
    options: OsrmRouteQueryOptions = {}
  ): Promise<OsrmRouteResponse> {
    const path = `route/v1/${this.profile}/${this.createCoordinatesPath(points)}`

    const params: Record<string, string> = {}
    if (options.alternatives != null) {
      params.alternatives = String(options.alternatives)
    }

    if (options.overview != null) {
      params.overview = String(options.overview)
    }

    if (options.steps != null) {
      params.steps = String(options.steps)
    }

    if (options.annotations != null) {
      params.annotations = options.annotations === true ? 'true' : options.annotations.join(',')
    }

    if (options.geometries != null) {
      params.geometries = options.geometries
    }

    if (options.continueStraight != null) {
      params.continue_straight = String(options.continueStraight)
    }

    if (options.skipWaypoints != null) {
      params.skip_waypoints = String(options.skipWaypoints)
    }

    return await this.get(path, params)
  }

  async calculateRoute (
    from: Coordinates,
    to: Coordinates,
    options: OsrmRouteQueryOptions = {}
  ): Promise<OsrmRoute> {
    const response = await this.calculateMultiLegRoute([from, to], options)

    return response.routes[0]
  }

  async calculateTable (
    coordinates: Coordinates[],
    options: OsrmTableQueryOptions = {}
  ): Promise<OsrmTableResponse> {
    const path = `table/v1/${this.profile}/${this.createCoordinatesPath(coordinates)}`

    const params: Record<string, string> = {}

    if (options.annotations != null) {
      params.annotations = options.annotations.join(',')
    }

    if (options.sources != null && options.sources.length > 0) {
      params.sources = options.sources.join(';')
    }

    if (options.destinations != null && options.destinations.length > 0) {
      params.destinations = options.destinations.join(';')
    }

    if (options.skipWaypoints != null) {
      params.skip_waypoints = String(options.skipWaypoints)
    }

    return await this.get(path, params)
  }

  async calculateTile (
    from: Coordinates,
    destinations: Coordinates[]
  ): Promise<OsrmTileResponse> {
    const coordinates = [from, ...destinations]
    const table = await this.calculateTable(coordinates, {
      sources: [0],
      destinations: destinations.map((_, index) => index + 1)
    })

    return {
      durations: table.durations.map(row => row.map(duration => duration ?? 0))
    }
  }

  private async get<TResponse> (
    path: string,
    params: Record<string, string>
  ): Promise<TResponse> {
    const url = new URL(path, this.baseUrl)

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(this.timeout) })
      if (!response.ok) {
        const responseBody = await response.text()

        throw new Error(`OSRM request failed with status ${response.status}: ${responseBody || '<empty response body>'}`)
      }

      return await response.json() as TResponse
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('OSRM request timed out', { cause: error })
      }

      throw error
    }
  }

  private createCoordinatesPath (coordinates: Coordinates[]): string {
    return coordinates
      .map(coordinate => `${coordinate.longitude},${coordinate.latitude}`)
      .join(';')
  }
}
