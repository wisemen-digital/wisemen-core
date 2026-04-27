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
      const energy = new Energy(5000, EnergyUnit.JOULE)

      expect(energy.getValueIn(EnergyUnit.KILOJOULE)).toBe(5)
    })

    it('converts kilowatt hour to joule', () => {
      const energy = new Energy(1, EnergyUnit.KILOWATT_HOUR)

      expect(energy.getValueIn(EnergyUnit.JOULE)).toBe(3_600_000)
    })

    it('converts watt hour to kilowatt hour', () => {
      const energy = new Energy(1500, EnergyUnit.WATT_HOUR)

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

  describe('toString', () => {
    it('formats joules', () => {
      const energy = new Energy(1, EnergyUnit.JOULE)

      expect(energy.toString(EnergyUnit.JOULE)).toBe('1 J')
    })

    it('formats decijoules', () => {
      const energy = new Energy(1, EnergyUnit.DECIJOULE)

      expect(energy.toString(EnergyUnit.DECIJOULE)).toBe('1 dJ')
    })

    it('formats centijoules', () => {
      const energy = new Energy(1, EnergyUnit.CENTIJOULE)

      expect(energy.toString(EnergyUnit.CENTIJOULE)).toBe('1 cJ')
    })

    it('formats millijoules', () => {
      const energy = new Energy(1, EnergyUnit.MILLIJOULE)

      expect(energy.toString(EnergyUnit.MILLIJOULE)).toBe('1 mJ')
    })

    it('formats microjoules', () => {
      const energy = new Energy(1, EnergyUnit.MICROJOULE)

      expect(energy.toString(EnergyUnit.MICROJOULE)).toBe('1 μJ')
    })

    it('formats nanojoules', () => {
      const energy = new Energy(1, EnergyUnit.NANOJOULE)

      expect(energy.toString(EnergyUnit.NANOJOULE)).toBe('1 nJ')
    })

    it('formats picojoules', () => {
      const energy = new Energy(1, EnergyUnit.PICOJOULE)

      expect(energy.toString(EnergyUnit.PICOJOULE)).toBe('1 pJ')
    })

    it('formats femtojoules', () => {
      const energy = new Energy(1, EnergyUnit.FEMTOJOULE)

      expect(energy.toString(EnergyUnit.FEMTOJOULE)).toBe('1 fJ')
    })

    it('formats attojoules', () => {
      const energy = new Energy(1, EnergyUnit.ATTOJOULE)

      expect(energy.toString(EnergyUnit.ATTOJOULE)).toBe('1 aJ')
    })

    it('formats zeptojoules', () => {
      const energy = new Energy(1, EnergyUnit.ZEPTOJOULE)

      expect(energy.toString(EnergyUnit.ZEPTOJOULE)).toBe('1 zJ')
    })

    it('formats yoctojoules', () => {
      const energy = new Energy(1, EnergyUnit.YOCTOJOULE)

      expect(energy.toString(EnergyUnit.YOCTOJOULE)).toBe('1 yJ')
    })

    it('formats rontojoules', () => {
      const energy = new Energy(1, EnergyUnit.RONTOJOULE)

      expect(energy.toString(EnergyUnit.RONTOJOULE)).toBe('1 rJ')
    })

    it('formats quectojoules', () => {
      const energy = new Energy(1, EnergyUnit.QUECTOJOULE)

      expect(energy.toString(EnergyUnit.QUECTOJOULE)).toBe('1 qJ')
    })

    it('formats decajoules', () => {
      const energy = new Energy(1, EnergyUnit.DECAJOULE)

      expect(energy.toString(EnergyUnit.DECAJOULE)).toBe('1 daJ')
    })

    it('formats hectojoules', () => {
      const energy = new Energy(1, EnergyUnit.HECTOJOULE)

      expect(energy.toString(EnergyUnit.HECTOJOULE)).toBe('1 hJ')
    })

    it('formats kilojoules', () => {
      const energy = new Energy(1, EnergyUnit.KILOJOULE)

      expect(energy.toString(EnergyUnit.KILOJOULE)).toBe('1 kJ')
    })

    it('formats megajoules', () => {
      const energy = new Energy(1, EnergyUnit.MEGAJOULE)

      expect(energy.toString(EnergyUnit.MEGAJOULE)).toBe('1 MJ')
    })

    it('formats gigajoules', () => {
      const energy = new Energy(1, EnergyUnit.GIGAJOULE)

      expect(energy.toString(EnergyUnit.GIGAJOULE)).toBe('1 GJ')
    })

    it('formats terajoules', () => {
      const energy = new Energy(1, EnergyUnit.TERAJOULE)

      expect(energy.toString(EnergyUnit.TERAJOULE)).toBe('1 TJ')
    })

    it('formats petajoules', () => {
      const energy = new Energy(1, EnergyUnit.PETAJOULE)

      expect(energy.toString(EnergyUnit.PETAJOULE)).toBe('1 PJ')
    })

    it('formats exajoules', () => {
      const energy = new Energy(1, EnergyUnit.EXAJOULE)

      expect(energy.toString(EnergyUnit.EXAJOULE)).toBe('1 EJ')
    })

    it('formats zettajoules', () => {
      const energy = new Energy(1, EnergyUnit.ZETTAJOULE)

      expect(energy.toString(EnergyUnit.ZETTAJOULE)).toBe('1 ZJ')
    })

    it('formats yottajoules', () => {
      const energy = new Energy(1, EnergyUnit.YOTTAJOULE)

      expect(energy.toString(EnergyUnit.YOTTAJOULE)).toBe('1 YJ')
    })

    it('formats ronnajoules', () => {
      const energy = new Energy(1, EnergyUnit.RONNAJOULE)

      expect(energy.toString(EnergyUnit.RONNAJOULE)).toBe('1 RJ')
    })

    it('formats quettajoules', () => {
      const energy = new Energy(1, EnergyUnit.QUETAJOULE)

      expect(energy.toString(EnergyUnit.QUETAJOULE)).toBe('1 QJ')
    })

    it('formats watt hours', () => {
      const energy = new Energy(1, EnergyUnit.WATT_HOUR)

      expect(energy.toString(EnergyUnit.WATT_HOUR)).toBe('1 Wh')
    })

    it('formats kilowatt hours', () => {
      const energy = new Energy(1, EnergyUnit.KILOWATT_HOUR)

      expect(energy.toString(EnergyUnit.KILOWATT_HOUR)).toBe('1 kWh')
    })

    it('formats megawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.MEGAWATT_HOUR)

      expect(energy.toString(EnergyUnit.MEGAWATT_HOUR)).toBe('1 MWh')
    })

    it('formats gigawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.GIGAWATT_HOUR)

      expect(energy.toString(EnergyUnit.GIGAWATT_HOUR)).toBe('1 GWh')
    })

    it('formats terawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.TERAWATT_HOUR)

      expect(energy.toString(EnergyUnit.TERAWATT_HOUR)).toBe('1 TWh')
    })

    it('formats petawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.PETAWATT_HOUR)

      expect(energy.toString(EnergyUnit.PETAWATT_HOUR)).toBe('1 PWh')
    })

    it('formats exawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.EXAWATT_HOUR)

      expect(energy.toString(EnergyUnit.EXAWATT_HOUR)).toBe('1 EWh')
    })

    it('formats zettawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.ZETTAWATT_HOUR)

      expect(energy.toString(EnergyUnit.ZETTAWATT_HOUR)).toBe('1 ZWh')
    })

    it('formats yottawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.YOTTAWATT_HOUR)

      expect(energy.toString(EnergyUnit.YOTTAWATT_HOUR)).toBe('1 YWh')
    })

    it('formats ronnawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.RONNAWATT_HOUR)

      expect(energy.toString(EnergyUnit.RONNAWATT_HOUR)).toBe('1 RWh')
    })

    it('formats quettawatt hours', () => {
      const energy = new Energy(1, EnergyUnit.QUETTAWATT_HOUR)

      expect(energy.toString(EnergyUnit.QUETTAWATT_HOUR)).toBe('1 QWh')
    })
  })
})
