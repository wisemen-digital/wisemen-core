import {
  SpeedDto,
  SpeedUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Speed } from './speed.model'

describe('speed', () => {
  describe('constructor', () => {
    it('creates a speed with value and unit', () => {
      const speed = new Speed(100, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.value).toBe(100)
      expect(speed.unit).toBe(SpeedUnit.KILOMETER_PER_HOUR)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const speed = new Speed(100, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.getValueIn(SpeedUnit.KILOMETER_PER_HOUR)).toBe(100)
    })

    it('converts km/h to m/s', () => {
      const speed = new Speed(36, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.getValueIn(SpeedUnit.METER_PER_SECOND)).toBe(10)
    })

    it('converts m/s to km/h', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.getValueIn(SpeedUnit.KILOMETER_PER_HOUR)).toBe(36)
    })

    it('converts km/h to mph', () => {
      const speed = new Speed(100, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.getValueIn(SpeedUnit.MILES_PER_HOUR)).toBeCloseTo(62.137, 2)
    })
  })

  describe('toDto', () => {
    it('returns a SpeedDto', () => {
      const speed = new Speed(100, SpeedUnit.KILOMETER_PER_HOUR)
      const dto = speed.toDto()

      expect(dto).toBeInstanceOf(SpeedDto)
      expect(dto.value).toBe(100)
      expect(dto.unit).toBe(SpeedUnit.KILOMETER_PER_HOUR)
    })
  })

  describe('toString', () => {
    it('formats km/h', () => {
      const speed = new Speed(100.56, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.toString(SpeedUnit.KILOMETER_PER_HOUR)).toBe('100.6 km/h')
    })

    it('formats m/s', () => {
      const speed = new Speed(36, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.toString(SpeedUnit.METER_PER_SECOND)).toBe('10 m/s')
    })

    it('uses the stored unit when no unit is provided', () => {
      const speed = new Speed(100, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.toString()).toBe('100 km/h')
    })
  })
})
