/** [longitude, latitude]  */
export type OsrmCoordinates =  [number, number]

export type OsrmRouteAnnotation =
  | 'distance'
  | 'duration'
  | 'speed'
  | 'nodes'
  | 'datasources'
  | 'weight'

export type OsrmTableAnnotation = 'distance' | 'duration'

export interface OsrmRouteQueryOptions {
  alternatives?: boolean
  overview?: 'simplified' | 'full' | false
  steps?: boolean
  annotations?: true | OsrmRouteAnnotation[]
  continueStraight?: boolean
  skipWaypoints?: boolean
}

export interface OsrmTableQueryOptions {
  annotations?: OsrmTableAnnotation[]
  sources?: number[]
  destinations?: number[]
  skipWaypoints?: boolean
}

export interface OsrmRouteResponse {
  routes: OsrmRoute[]
}

export interface OsrmTableResponse {
  code: string
  /** durations of routes in seconds, null if no route exists */
  durations: Array<Array<number | null>>
  /** distances of routes in meters, null if no route exists */
  distances?: Array<Array<number | null>>
  sources?: OsrmWaypoint[]
  destinations?: OsrmWaypoint[]
}

export interface OsrmTileResponse {
  /** null if no route exists */
  durations: (number | null)[][]
}

export interface OsrmWaypoint {
  location: OsrmCoordinates
  name: string
  distance: number
  hint: string
}

export interface OsrmRoute {
  /** distance as float in meters */
  distance: number
  /** duration as float in seconds */
  duration: number
  geometry: OsrmRouteGeometry
  legs: OsrmRouteLeg[]
}

export interface OsrmRouteGeometry {
  coordinates: OsrmCoordinates[]
}

export interface OsrmRouteLeg {
  distance: number
  duration: number
}
