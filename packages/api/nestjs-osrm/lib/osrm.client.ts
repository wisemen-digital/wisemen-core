import { Injectable } from '@nestjs/common'
import type { Coordinates } from '@wisemen/coordinates'
import type { OsrmRoute, OsrmRouteQueryOptions, OsrmRouteResponse, OsrmTableQueryOptions, OsrmTableResponse, OsrmTileResponse } from './osrm.types.js'

@Injectable()
export abstract class OsrmClient {
  /**
   * Calculates a route through every provided coordinate in order and returns
   * the raw OSRM route response.
   */
  abstract calculateMultiLegRoute (
    points: Coordinates[],
    options?: OsrmRouteQueryOptions
  ): Promise<OsrmRouteResponse>

  /**
   * Calculates a route between two coordinates and returns the first route
   * result.
   */
  abstract calculateRoute (
    from: Coordinates,
    to: Coordinates,
    options?: OsrmRouteQueryOptions
  ): Promise<OsrmRoute>

  /**
   * Calculates a duration and distance matrix for the provided coordinates.
   */
  abstract calculateTable (
    coordinates: Coordinates[],
    options?: OsrmTableQueryOptions
  ): Promise<OsrmTableResponse>

  /**
   * Calculates a one-to-many duration matrix from one origin to multiple
   * destinations.
   */
  abstract calculateTile (
    from: Coordinates,
    destinations: Coordinates[]
  ): Promise<OsrmTileResponse>
}
