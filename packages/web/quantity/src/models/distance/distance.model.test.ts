import {
  DistanceDto,
  DistanceUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Distance } from './distance.model'

describe('distance', () => {
  describe('constructor', () => {
    it('creates a distance with value and unit', () => {
      const distance = new Distance(100, DistanceUnit.METER)

      expect(distance.value).toBe(100)
      expect(distance.unit).toBe(DistanceUnit.METER)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const distance = new Distance(100, DistanceUnit.METER)

      expect(distance.getValueIn(DistanceUnit.METER)).toBe(100)
    })

    it('converts meter to kilometer', () => {
      const distance = new Distance(1_500, DistanceUnit.METER)

      expect(distance.getValueIn(DistanceUnit.KILOMETER)).toBe(1.5)
    })

    it('converts meter to centimeter', () => {
      const distance = new Distance(1, DistanceUnit.METER)

      expect(distance.getValueIn(DistanceUnit.CENTIMETER)).toBe(100)
    })

    it('converts kilometer to mile', () => {
      const distance = new Distance(1, DistanceUnit.KILOMETER)

      expect(distance.getValueIn(DistanceUnit.MILES)).toBeCloseTo(0.6214, 3)
    })
  })

  describe('toDto', () => {
    it('returns a DistanceDto', () => {
      const distance = new Distance(100, DistanceUnit.METER)
      const dto = distance.toDto()

      expect(dto).toBeInstanceOf(DistanceDto)
      expect(dto.value).toBe(100)
      expect(dto.unit).toBe(DistanceUnit.METER)
    })
  })

  describe('toString', () => {
    it('formats meters', () => {
      const distance = new Distance(150.67, DistanceUnit.METER)

      expect(distance.toString(DistanceUnit.METER)).toBe('150.7 m')
    })

    it('formats kilometers', () => {
      const distance = new Distance(2_500, DistanceUnit.METER)

      expect(distance.toString(DistanceUnit.KILOMETER)).toBe('2.5 km')
    })

    it('uses the stored unit when no unit is provided', () => {
      const distance = new Distance(100, DistanceUnit.METER)

      expect(distance.toString()).toBe('100 m')
    })

    it('formats decimeters', () => {
      const distance = new Distance(1, DistanceUnit.DECIMETER)

      expect(distance.toString(DistanceUnit.DECIMETER)).toBe('1 dm')
    })

    it('formats centimeters', () => {
      const distance = new Distance(1, DistanceUnit.CENTIMETER)

      expect(distance.toString(DistanceUnit.CENTIMETER)).toBe('1 cm')
    })

    it('formats millimeters', () => {
      const distance = new Distance(1, DistanceUnit.MILLIMETER)

      expect(distance.toString(DistanceUnit.MILLIMETER)).toBe('1 mm')
    })

    it('formats micrometers', () => {
      const distance = new Distance(1, DistanceUnit.MICROMETER)

      expect(distance.toString(DistanceUnit.MICROMETER)).toBe('1 μm')
    })

    it('formats nanometers', () => {
      const distance = new Distance(1, DistanceUnit.NANOMETER)

      expect(distance.toString(DistanceUnit.NANOMETER)).toBe('1 nm')
    })

    it('formats decameters', () => {
      const distance = new Distance(1, DistanceUnit.DECAMETER)

      expect(distance.toString(DistanceUnit.DECAMETER)).toBe('1 dam')
    })

    it('formats hectometers', () => {
      const distance = new Distance(1, DistanceUnit.HECTOMETER)

      expect(distance.toString(DistanceUnit.HECTOMETER)).toBe('1 hm')
    })

    it('formats miles', () => {
      const distance = new Distance(1, DistanceUnit.MILES)

      expect(distance.toString(DistanceUnit.MILES)).toBe('1 mi')
    })

    it('formats inches', () => {
      const distance = new Distance(1, DistanceUnit.INCH)

      expect(distance.toString(DistanceUnit.INCH)).toBe('1 in')
    })

    it('formats feet', () => {
      const distance = new Distance(1, DistanceUnit.FOOT)

      expect(distance.toString(DistanceUnit.FOOT)).toBe('1 ft')
    })

    it('formats yards', () => {
      const distance = new Distance(1, DistanceUnit.YARD)

      expect(distance.toString(DistanceUnit.YARD)).toBe('1 yd')
    })
  })
})
