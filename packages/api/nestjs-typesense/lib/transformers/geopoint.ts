import { Coordinates } from '@wisemen/coordinates'
import { TypesenseGeoPoint } from '../schema/field.js'

export function createGeopoint(c: null): undefined 
export function createGeopoint(c: undefined): undefined 
export function createGeopoint(c: Coordinates): TypesenseGeoPoint 
export function createGeopoint(c: Coordinates | null | undefined): TypesenseGeoPoint | undefined 
export function createGeopoint(c: Coordinates | null | undefined): TypesenseGeoPoint | undefined {
  if(c == null) {
    return undefined
  }

  return [c.latitude, c.longitude]
}

export function parseGeopoint(g: undefined): null 
export function parseGeopoint(g: TypesenseGeoPoint): Coordinates 
export function parseGeopoint(g: TypesenseGeoPoint | undefined): Coordinates | null 
export function parseGeopoint(g: TypesenseGeoPoint | undefined): Coordinates | null {
  if(g == null) {
    return null
  }
  
  return new Coordinates(g[0], g[1])
}