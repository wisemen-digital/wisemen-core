import { describe, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { CoordinatesQueryBuilder } from '#src/coordinates-query.builder.js'
import { CoordinatesQuery } from '#src/coordinates.query.js'

describe('CoordinatesQuery', () => {
  describe('validation', () => {
    it('should pass validation with valid coordinates', async () => {
      const query = new CoordinatesQuery()

      query.latitude = '50.894565'
      query.longitude = '5.420593'

      const errors = await validate(query)

      expect(errors.length).toBe(0)
    })

    it('should pass validation with valid (15 float long) coordinates', async () => {
      const query = new CoordinatesQuery()

      query.latitude = '44.43025734694905'
      query.longitude = '44.43025734694905'

      const errors = await validate(query)

      expect(errors.length).toBe(0)
    })

    it('should fail validation with invalid latitude string', async () => {
      const query = new CoordinatesQuery()

      query.latitude = 'invalid' // Invalid number string
      query.longitude = '5.420593'

      const errors = await validate(query)

      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].property).toBe('latitude')
    })

    it('should fail validation with invalid longitude string', async () => {
      const query = new CoordinatesQuery()

      query.latitude = '50.894565'
      query.longitude = 'invalid' // Invalid number string

      const errors = await validate(query)

      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].property).toBe('longitude')
    })

    it('should fail validation with out of range latitude', async () => {
      const query = new CoordinatesQuery()

      query.latitude = '95.0' // Out of valid latitude range
      query.longitude = '5.420593'

      const errors = await validate(query)

      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].property).toBe('latitude')
    })

    it('should fail validation with out of range longitude', async () => {
      const query = new CoordinatesQuery()

      query.latitude = '50.894565'
      query.longitude = '185.0' // Out of valid longitude range

      const errors = await validate(query)

      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].property).toBe('longitude')
    })
  })

  describe('toCoordinates', () => {
    it('should return coordinates when both latitude and longitude are set', () => {
      const query = new CoordinatesQuery()

      query.latitude = '50.894565'
      query.longitude = '5.420593'

      const coordinates = query.toCoordinates()

      expect(coordinates).not.toBeNull()
      expect(coordinates?.latitude).toBe(50.894565)
      expect(coordinates?.longitude).toBe(5.420593)
    })
  })
})

describe('CoordinatesQueryBuilder', () => {
  it('should build query with latitude', () => {
    const query = new CoordinatesQueryBuilder()
      .withLatitude(50.894565509367055)
      .build()

    expect(query.latitude).toBe('50.894565509367055')
    expect(query.longitude).toBeUndefined()
  })

  it('should build query with longitude', () => {
    const query = new CoordinatesQueryBuilder()
      .withLongitude(5.420593668305642)
      .build()

    expect(query.longitude).toBe('5.420593668305642')
    expect(query.latitude).toBeUndefined()
  })
})
