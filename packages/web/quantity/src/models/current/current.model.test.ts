import {
  CurrentDto,
  CurrentUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Current } from './current.model'

describe('current', () => {
  describe('constructor', () => {
    it('creates a current with value and unit', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.value).toBe(5)
      expect(current.unit).toBe(CurrentUnit.AMPERE)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.AMPERE)).toBe(5)
    })

    it('converts ampere to milliampere', () => {
      const current = new Current(1, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.MILLIAMPERE)).toBe(1000)
    })

    it('converts milliampere to ampere', () => {
      const current = new Current(500, CurrentUnit.MILLIAMPERE)

      expect(current.getValueIn(CurrentUnit.AMPERE)).toBe(0.5)
    })

    it('converts ampere to kiloampere', () => {
      const current = new Current(5000, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.KILOAMPERE)).toBe(5)
    })
  })

  describe('toDto', () => {
    it('returns a CurrentDto', () => {
      const current = new Current(5, CurrentUnit.AMPERE)
      const dto = current.toDto()

      expect(dto).toBeInstanceOf(CurrentDto)
      expect(dto.value).toBe(5)
      expect(dto.unit).toBe(CurrentUnit.AMPERE)
    })
  })

  describe('toString', () => {
    it('formats ampere', () => {
      const current = new Current(5.67, CurrentUnit.AMPERE)

      expect(current.toString(CurrentUnit.AMPERE)).toBe('5.7 A')
    })

    it('formats milliampere', () => {
      const current = new Current(1, CurrentUnit.AMPERE)

      expect(current.toString(CurrentUnit.MILLIAMPERE)).toBe('1,000 mA')
    })

    it('uses the stored unit when no unit is provided', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.toString()).toBe('5 A')
    })

    it('formats deciampere', () => {
      const current = new Current(1, CurrentUnit.DECIAMPERE)

      expect(current.toString(CurrentUnit.DECIAMPERE)).toBe('1 dA')
    })

    it('formats centiampere', () => {
      const current = new Current(1, CurrentUnit.CENTIAMPERE)

      expect(current.toString(CurrentUnit.CENTIAMPERE)).toBe('1 cA')
    })

    it('formats microampere', () => {
      const current = new Current(1, CurrentUnit.MICROAMPERE)

      expect(current.toString(CurrentUnit.MICROAMPERE)).toBe('1 μA')
    })

    it('formats nanoampere', () => {
      const current = new Current(1, CurrentUnit.NANOAMPERE)

      expect(current.toString(CurrentUnit.NANOAMPERE)).toBe('1 nA')
    })

    it('formats picoampere', () => {
      const current = new Current(1, CurrentUnit.PICOAMPERE)

      expect(current.toString(CurrentUnit.PICOAMPERE)).toBe('1 pA')
    })

    it('formats femtoampere', () => {
      const current = new Current(1, CurrentUnit.FEMTOAMPERE)

      expect(current.toString(CurrentUnit.FEMTOAMPERE)).toBe('1 fA')
    })

    it('formats attoampere', () => {
      const current = new Current(1, CurrentUnit.ATTOAMPERE)

      expect(current.toString(CurrentUnit.ATTOAMPERE)).toBe('1 aA')
    })

    it('formats zeptoampere', () => {
      const current = new Current(1, CurrentUnit.ZEPTOAMPERE)

      expect(current.toString(CurrentUnit.ZEPTOAMPERE)).toBe('1 zA')
    })

    it('formats yoctoampere', () => {
      const current = new Current(1, CurrentUnit.YOCTOAMPERE)

      expect(current.toString(CurrentUnit.YOCTOAMPERE)).toBe('1 yA')
    })

    it('formats rontoampere', () => {
      const current = new Current(1, CurrentUnit.RONTOAMPERE)

      expect(current.toString(CurrentUnit.RONTOAMPERE)).toBe('1 rA')
    })

    it('formats quectoampere', () => {
      const current = new Current(1, CurrentUnit.QUECTOAMPERE)

      expect(current.toString(CurrentUnit.QUECTOAMPERE)).toBe('1 qA')
    })

    it('formats decaampere', () => {
      const current = new Current(1, CurrentUnit.DECAAMPERE)

      expect(current.toString(CurrentUnit.DECAAMPERE)).toBe('1 daA')
    })

    it('formats hectoampere', () => {
      const current = new Current(1, CurrentUnit.HECTOAMPERE)

      expect(current.toString(CurrentUnit.HECTOAMPERE)).toBe('1 hA')
    })

    it('formats kiloampere', () => {
      const current = new Current(1, CurrentUnit.KILOAMPERE)

      expect(current.toString(CurrentUnit.KILOAMPERE)).toBe('1 kA')
    })

    it('formats megaampere', () => {
      const current = new Current(1, CurrentUnit.MEGAAMPERE)

      expect(current.toString(CurrentUnit.MEGAAMPERE)).toBe('1 MA')
    })

    it('formats gigaampere', () => {
      const current = new Current(1, CurrentUnit.GIGAAMPERE)

      expect(current.toString(CurrentUnit.GIGAAMPERE)).toBe('1 GA')
    })

    it('formats teraampere', () => {
      const current = new Current(1, CurrentUnit.TERAAMPERE)

      expect(current.toString(CurrentUnit.TERAAMPERE)).toBe('1 TA')
    })

    it('formats petaampere', () => {
      const current = new Current(1, CurrentUnit.PETAAMPERE)

      expect(current.toString(CurrentUnit.PETAAMPERE)).toBe('1 PA')
    })

    it('formats exaampere', () => {
      const current = new Current(1, CurrentUnit.EXAAMPERE)

      expect(current.toString(CurrentUnit.EXAAMPERE)).toBe('1 EA')
    })

    it('formats zettaampere', () => {
      const current = new Current(1, CurrentUnit.ZETTAAMPERE)

      expect(current.toString(CurrentUnit.ZETTAAMPERE)).toBe('1 ZA')
    })

    it('formats yottaampere', () => {
      const current = new Current(1, CurrentUnit.YOTTAAMPERE)

      expect(current.toString(CurrentUnit.YOTTAAMPERE)).toBe('1 YA')
    })

    it('formats ronnaampere', () => {
      const current = new Current(1, CurrentUnit.RONNAAMPERE)

      expect(current.toString(CurrentUnit.RONNAAMPERE)).toBe('1 RA')
    })

    it('formats quettaampere', () => {
      const current = new Current(1, CurrentUnit.QUETTAAMPERE)

      expect(current.toString(CurrentUnit.QUETTAAMPERE)).toBe('1 QA')
    })
  })
})
