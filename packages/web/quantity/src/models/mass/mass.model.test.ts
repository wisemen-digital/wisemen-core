import {
  MassDto,
  MassUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Mass } from './mass.model'

describe('mass', () => {
  describe('constructor', () => {
    it('creates a mass with value and unit', () => {
      const mass = new Mass(75, MassUnit.KILOGRAM)

      expect(mass.value).toBe(75)
      expect(mass.unit).toBe(MassUnit.KILOGRAM)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const mass = new Mass(75, MassUnit.KILOGRAM)

      expect(mass.getValueIn(MassUnit.KILOGRAM)).toBe(75)
    })

    it('converts kilogram to gram', () => {
      const mass = new Mass(2.5, MassUnit.KILOGRAM)

      expect(mass.getValueIn(MassUnit.GRAM)).toBe(2_500)
    })

    it('converts kilogram to pound', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.getValueIn(MassUnit.POUND)).toBeCloseTo(2.2046, 3)
    })

    it('converts tonne to kilogram', () => {
      const mass = new Mass(1, MassUnit.TONNE)

      expect(mass.getValueIn(MassUnit.KILOGRAM)).toBe(1_000)
    })
  })

  describe('toDto', () => {
    it('returns a MassDto', () => {
      const mass = new Mass(75, MassUnit.KILOGRAM)
      const dto = mass.toDto()

      expect(dto).toBeInstanceOf(MassDto)
      expect(dto.value).toBe(75)
      expect(dto.unit).toBe(MassUnit.KILOGRAM)
    })
  })

  describe('toString', () => {
    it('formats kilograms', () => {
      const mass = new Mass(75.45, MassUnit.KILOGRAM)

      expect(mass.toString(MassUnit.KILOGRAM)).toBe('75.5 kg')
    })

    it('formats grams', () => {
      const mass = new Mass(2.5, MassUnit.KILOGRAM)

      expect(mass.toString(MassUnit.GRAM)).toBe('2,500 g')
    })

    it('uses the stored unit when no unit is provided', () => {
      const mass = new Mass(75, MassUnit.KILOGRAM)

      expect(mass.toString()).toBe('75 kg')
    })
  })
})
