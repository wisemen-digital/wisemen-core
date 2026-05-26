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

      expect(mass.getValueIn(MassUnit.GRAM)).toBe(2500)
    })

    it('converts kilogram to pound', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.getValueIn(MassUnit.POUND)).toBeCloseTo(2.2046, 3)
    })

    it('converts tonne to kilogram', () => {
      const mass = new Mass(1, MassUnit.TONNE)

      expect(mass.getValueIn(MassUnit.KILOGRAM)).toBe(1000)
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

    it('formats decigrams', () => {
      const mass = new Mass(1, MassUnit.DECIGRAM)

      expect(mass.toString(MassUnit.DECIGRAM)).toBe('1 dg')
    })

    it('formats centigrams', () => {
      const mass = new Mass(1, MassUnit.CENTIGRAM)

      expect(mass.toString(MassUnit.CENTIGRAM)).toBe('1 cg')
    })

    it('formats milligrams', () => {
      const mass = new Mass(1, MassUnit.MILLIGRAM)

      expect(mass.toString(MassUnit.MILLIGRAM)).toBe('1 mg')
    })

    it('formats micrograms', () => {
      const mass = new Mass(1, MassUnit.MICROGRAM)

      expect(mass.toString(MassUnit.MICROGRAM)).toBe('1 μg')
    })

    it('formats nanograms', () => {
      const mass = new Mass(1, MassUnit.NANOGRAM)

      expect(mass.toString(MassUnit.NANOGRAM)).toBe('1 ng')
    })

    it('formats decagrams', () => {
      const mass = new Mass(1, MassUnit.DECAGRAM)

      expect(mass.toString(MassUnit.DECAGRAM)).toBe('1 dag')
    })

    it('formats hectograms', () => {
      const mass = new Mass(1, MassUnit.HECTOGRAM)

      expect(mass.toString(MassUnit.HECTOGRAM)).toBe('1 hg')
    })

    it('formats tonnes', () => {
      const mass = new Mass(1, MassUnit.TONNE)

      expect(mass.toString(MassUnit.TONNE)).toBe('1 t')
    })

    it('formats pounds', () => {
      const mass = new Mass(1, MassUnit.POUND)

      expect(mass.toString(MassUnit.POUND)).toBe('1 lb')
    })

    it('formats ounces', () => {
      const mass = new Mass(1, MassUnit.OUNCE)

      expect(mass.toString(MassUnit.OUNCE)).toBe('1 oz')
    })
  })
})
