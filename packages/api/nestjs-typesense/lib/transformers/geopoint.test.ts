import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Coordinates } from '@wisemen/coordinates'
import { createGeopoint, parseGeopoint } from './geopoint.js'


describe('createGeopoint', () => {
  it('converts coordinates to a [latitude, longitude] tuple', () => {
    const coordinates = new Coordinates(51.2194, 4.4025)

    expect(createGeopoint(coordinates)).toEqual([51.2194, 4.4025])
  })

  it('returns undefined for null', () => {
    expect(createGeopoint(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(createGeopoint(undefined)).toBeUndefined()
  })
})

describe('parseGeopoint', () => {
  it('converts a [latitude, longitude] tuple back to coordinates', () => {
    const coordinates = parseGeopoint([51.2194, 4.4025])

    expect(coordinates.latitude).toBe(51.2194)
    expect(coordinates.longitude).toBe(4.4025)
  })

  it('returns null for undefined', () => {
    expect(parseGeopoint(undefined)).toBeNull()
  })
})
