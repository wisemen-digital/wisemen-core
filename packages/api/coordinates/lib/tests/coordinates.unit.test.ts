import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Point } from 'typeorm'
import { Coordinates } from '#src/coordinates.js'

describe('Coordinates', () => {
  it('throws an error when -Infinity latitude is provided to the constructor', () => {
    expect(() => new Coordinates(-Infinity, 0)).toThrow()
  })

  it('throws an error when NaN latitude is provided to the constructor', () => {
    expect(() => new Coordinates(NaN, 0)).toThrow()
  })

  it('throws an error when less than 90 latitude is provided to the constructor', () => {
    expect(() => new Coordinates(-90.1, 0)).toThrow()
  })

  it('throws an error when more than 90 latitude is provided to the constructor', () => {
    expect(() => new Coordinates(90.1, 0)).toThrow()
  })

  it('throws an error when Infinity latitude is provided to the constructor', () => {
    expect(() => new Coordinates(Infinity, 0)).toThrow()
  })

  it('Creates a new Coordinates instance with the maximum latitude', () => {
    expect(() => new Coordinates(90, 0)).not.toThrow()
  })

  it('Creates a new Coordinates instance with the minimum latitude', () => {
    expect(() => new Coordinates(-90, 0)).not.toThrow()
  })

  it('Creates a new Coordinates instance with valid coordinates', () => {
    expect(() => new Coordinates(0, 0)).not.toThrow()
  })

  it('throws an error when -Infinity longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, -Infinity)).toThrow()
  })

  it('throws an error when NaN longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, NaN)).toThrow()
  })

  it('throws an error when less than 180 longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, -180.1)).toThrow()
  })

  it('throws an error when more than 180 longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, 180.1)).toThrow()
  })

  it('throws an error when Infinity longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, Infinity)).toThrow()
  })

  it('Creates a new Coordinates instance with the maximum longitude', () => {
    expect(() => new Coordinates(0, 180)).not.toThrow()
  })

  it('Creates a new Coordinates instance with the minimum longitude', () => {
    expect(() => new Coordinates(0, -180)).not.toThrow()
  })

  it('Maps Coordinates to a GeoJSON point', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const point = coordinates.toPoint()

    expect(point).toStrictEqual({
      type: 'Point',
      coordinates: [5.420593668305642, 50.894565509367055]
    })
  })

  it('Creates coordinates from a GeoJSON point', () => {
    const point: Point = {
      type: 'Point',
      coordinates: [5.420593668305642, 50.894565509367055]
    }

    const coordinates = new Coordinates(point)

    expect(coordinates.latitude).toBe(50.894565509367055)
    expect(coordinates.longitude).toBe(5.420593668305642)
  })

  it('Returns true when comparing the same locations', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const otherCoordinates = new Coordinates(50.894565509367055, 5.420593668305642)

    expect(coordinates.equals(otherCoordinates)).toBe(true)
  })

  it('Returns true when comparing to self', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)

    expect(coordinates.equals(coordinates)).toBe(true)
  })

  it('Returns false when comparing to other coordinates', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const otherCoordinates = new Coordinates(50, 5)

    expect(coordinates.equals(otherCoordinates)).toBe(false)
  })

  describe('distance', () => {
    it('returns 0 for the same coordinates', () => {
      const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)

      expect(coordinates.distance(coordinates).meters).toBe(0)
    })

    it('returns the correct distance', () => {
      const from = new Coordinates(50.90572271320099, 5.415921981769873)
      const to = new Coordinates(50.90556427063465, 5.416287446638186)

      expect(from.distance(to).meters).toBeCloseTo(31.16, 0)
    })

    it('returns the correct distance', () => {
      const from = new Coordinates(52.375603, 4.903206)
      const to = new Coordinates(52.366059, 4.926692)

      expect(from.distance(to).kilometers).toBeCloseTo(1.92)
    })

    it('parses a wkb string of a point', () => {
      const coordinates = new Coordinates('0101000020E610000078304FD4BF7152C02C40EE3517524440')

      expect(coordinates.latitude).toBeCloseTo(40.641333333333336)
      expect(coordinates.longitude).toBeCloseTo(-73.77733333333333)
    })
  })
})
