import {
  DurationDto,
  DurationUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Duration } from './duration.model'

describe('duration', () => {
  describe('constructor', () => {
    it('creates a duration with value and unit', () => {
      const duration = new Duration(60, DurationUnit.SECONDS)

      expect(duration.value).toBe(60)
      expect(duration.unit).toBe(DurationUnit.SECONDS)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const duration = new Duration(60, DurationUnit.SECONDS)

      expect(duration.getValueIn(DurationUnit.SECONDS)).toBe(60)
    })

    it('converts seconds to minutes', () => {
      const duration = new Duration(120, DurationUnit.SECONDS)

      expect(duration.getValueIn(DurationUnit.MINUTES)).toBe(2)
    })

    it('converts hours to seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.getValueIn(DurationUnit.SECONDS)).toBe(3_600)
    })

    it('converts days to hours', () => {
      const duration = new Duration(1, DurationUnit.DAYS)

      expect(duration.getValueIn(DurationUnit.HOURS)).toBe(24)
    })
  })

  describe('toDto', () => {
    it('returns a DurationDto', () => {
      const duration = new Duration(60, DurationUnit.SECONDS)
      const dto = duration.toDto()

      expect(dto).toBeInstanceOf(DurationDto)
      expect(dto.value).toBe(60)
      expect(dto.unit).toBe(DurationUnit.SECONDS)
    })
  })

  describe('toString', () => {
    it('formats seconds', () => {
      const duration = new Duration(45.78, DurationUnit.SECONDS)

      expect(duration.toString(DurationUnit.SECONDS)).toBe('45.8 sec')
    })

    it('formats hours', () => {
      const duration = new Duration(3_600, DurationUnit.SECONDS)

      expect(duration.toString(DurationUnit.HOURS)).toBe('1 hr')
    })

    it('uses the stored unit when no unit is provided', () => {
      const duration = new Duration(5, DurationUnit.MINUTES)

      expect(duration.toString()).toBe('5 min')
    })
  })
})
