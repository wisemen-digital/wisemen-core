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
  geometries?: 'polyline' | 'polyline6' | 'geojson'
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
  /** durations of routes in seconds */
  durations: Array<Array<number | null>>
  /** distances of routes in meters */
  distances?: Array<Array<number | null>>
  sources?: OsrmWaypoint[]
  destinations?: OsrmWaypoint[]
}

export interface OsrmTileResponse {
  durations: number[][]
}

export interface OsrmWaypoint {
  location: [number, number]
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
  coordinates: [number, number][]
}

export interface OsrmRouteLeg {
  distance: number
  duration: number
}
