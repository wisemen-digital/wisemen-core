import {
  EnergyDto,
  EnergyUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Energy } from './energy.model'

describe('energy', () => {
  describe('constructor', () => {
    it('creates an energy with value and unit', () => {
      const energy = new Energy(100, EnergyUnit.JOULE)

      expect(energy.value).toBe(100)
      expect(energy.unit).toBe(EnergyUnit.JOULE)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const energy = new Energy(100, EnergyUnit.JOULE)

      expect(energy.getValueIn(EnergyUnit.JOULE)).toBe(100)
    })

    it('converts joule to kilojoule', () => {
      const energy = new Energy(5_000, EnergyUnit.JOULE)

      expect(energy.getValueIn(EnergyUnit.KILOJOULE)).toBe(5)
    })

    it('converts kilowatt hour to joule', () => {
      const energy = new Energy(1, EnergyUnit.KILOWATT_HOUR)

      expect(energy.getValueIn(EnergyUnit.JOULE)).toBe(3_600_000)
    })

    it('converts watt hour to kilowatt hour', () => {
      const energy = new Energy(1_500, EnergyUnit.WATT_HOUR)

      expect(energy.getValueIn(EnergyUnit.KILOWATT_HOUR)).toBe(1.5)
    })
  })

  describe('toDto', () => {
    it('returns an EnergyDto', () => {
      const energy = new Energy(100, EnergyUnit.JOULE)
      const dto = energy.toDto()

      expect(dto).toBeInstanceOf(EnergyDto)
      expect(dto.value).toBe(100)
      expect(dto.unit).toBe(EnergyUnit.JOULE)
    })
  })
})
