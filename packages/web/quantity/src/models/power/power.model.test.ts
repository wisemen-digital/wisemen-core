import {
  PowerDto,
  PowerUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Power } from './power.model'

describe('power', () => {
  describe('constructor', () => {
    it('creates a power with value and unit', () => {
      const power = new Power(1000, PowerUnit.WATT)

      expect(power.value).toBe(1000)
      expect(power.unit).toBe(PowerUnit.WATT)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const power = new Power(1000, PowerUnit.WATT)

      expect(power.getValueIn(PowerUnit.WATT)).toBe(1000)
    })

    it('converts watt to kilowatt', () => {
      const power = new Power(2500, PowerUnit.WATT)

      expect(power.getValueIn(PowerUnit.KILOWATT)).toBe(2.5)
    })

    it('converts kilowatt to watt', () => {
      const power = new Power(1.5, PowerUnit.KILOWATT)

      expect(power.getValueIn(PowerUnit.WATT)).toBe(1500)
    })

    it('converts watt to megawatt', () => {
      const power = new Power(5_000_000, PowerUnit.WATT)

      expect(power.getValueIn(PowerUnit.MEGAWATT)).toBe(5)
    })
  })

  describe('toDto', () => {
    it('returns a PowerDto', () => {
      const power = new Power(1000, PowerUnit.WATT)
      const dto = power.toDto()

      expect(dto).toBeInstanceOf(PowerDto)
      expect(dto.value).toBe(1000)
      expect(dto.unit).toBe(PowerUnit.WATT)
    })
  })

  describe('toString', () => {
    it('formats watts', () => {
      const power = new Power(1, PowerUnit.WATT)

      expect(power.toString(PowerUnit.WATT)).toBe('1 W')
    })

    it('formats deciwatts', () => {
      const power = new Power(1, PowerUnit.DECIWATT)

      expect(power.toString(PowerUnit.DECIWATT)).toBe('1 dW')
    })

    it('formats centiwatts', () => {
      const power = new Power(1, PowerUnit.CENTIWATT)

      expect(power.toString(PowerUnit.CENTIWATT)).toBe('1 cW')
    })

    it('formats milliwatts', () => {
      const power = new Power(1, PowerUnit.MILLIWATT)

      expect(power.toString(PowerUnit.MILLIWATT)).toBe('1 mW')
    })

    it('formats microwatts', () => {
      const power = new Power(1, PowerUnit.MICROWATT)

      expect(power.toString(PowerUnit.MICROWATT)).toBe('1 μW')
    })

    it('formats nanowatts', () => {
      const power = new Power(1, PowerUnit.NANOWATT)

      expect(power.toString(PowerUnit.NANOWATT)).toBe('1 nW')
    })

    it('formats picowatts', () => {
      const power = new Power(1, PowerUnit.PICOWATT)

      expect(power.toString(PowerUnit.PICOWATT)).toBe('1 pW')
    })

    it('formats femtowatts', () => {
      const power = new Power(1, PowerUnit.FEMTOWATT)

      expect(power.toString(PowerUnit.FEMTOWATT)).toBe('1 fW')
    })

    it('formats attowatts', () => {
      const power = new Power(1, PowerUnit.ATTOWATT)

      expect(power.toString(PowerUnit.ATTOWATT)).toBe('1 aW')
    })

    it('formats zeptowatts', () => {
      const power = new Power(1, PowerUnit.ZEPTOWATT)

      expect(power.toString(PowerUnit.ZEPTOWATT)).toBe('1 zW')
    })

    it('formats yoctowatts', () => {
      const power = new Power(1, PowerUnit.YOCTOWATT)

      expect(power.toString(PowerUnit.YOCTOWATT)).toBe('1 yW')
    })

    it('formats rontowatts', () => {
      const power = new Power(1, PowerUnit.RONTOWATT)

      expect(power.toString(PowerUnit.RONTOWATT)).toBe('1 rW')
    })

    it('formats quectowatts', () => {
      const power = new Power(1, PowerUnit.QUECTOWATT)

      expect(power.toString(PowerUnit.QUECTOWATT)).toBe('1 qW')
    })

    it('formats decawatts', () => {
      const power = new Power(1, PowerUnit.DECAWATT)

      expect(power.toString(PowerUnit.DECAWATT)).toBe('1 daW')
    })

    it('formats hectowatts', () => {
      const power = new Power(1, PowerUnit.HECTOWATT)

      expect(power.toString(PowerUnit.HECTOWATT)).toBe('1 hW')
    })

    it('formats kilowatts', () => {
      const power = new Power(1, PowerUnit.KILOWATT)

      expect(power.toString(PowerUnit.KILOWATT)).toBe('1 kW')
    })

    it('formats megawatts', () => {
      const power = new Power(1, PowerUnit.MEGAWATT)

      expect(power.toString(PowerUnit.MEGAWATT)).toBe('1 MW')
    })

    it('formats gigawatts', () => {
      const power = new Power(1, PowerUnit.GIGAWATT)

      expect(power.toString(PowerUnit.GIGAWATT)).toBe('1 GW')
    })

    it('formats terawatts', () => {
      const power = new Power(1, PowerUnit.TERAWATT)

      expect(power.toString(PowerUnit.TERAWATT)).toBe('1 TW')
    })

    it('formats petawatts', () => {
      const power = new Power(1, PowerUnit.PETAWATT)

      expect(power.toString(PowerUnit.PETAWATT)).toBe('1 PW')
    })

    it('formats exawatts', () => {
      const power = new Power(1, PowerUnit.EXAWATT)

      expect(power.toString(PowerUnit.EXAWATT)).toBe('1 EW')
    })

    it('formats zettawatts', () => {
      const power = new Power(1, PowerUnit.ZETTAWATT)

      expect(power.toString(PowerUnit.ZETTAWATT)).toBe('1 ZW')
    })

    it('formats yottawatts', () => {
      const power = new Power(1, PowerUnit.YOTTAWATT)

      expect(power.toString(PowerUnit.YOTTAWATT)).toBe('1 YW')
    })

    it('formats ronnawatts', () => {
      const power = new Power(1, PowerUnit.RONNAWATT)

      expect(power.toString(PowerUnit.RONNAWATT)).toBe('1 RW')
    })

    it('formats quettawatts', () => {
      const power = new Power(1, PowerUnit.QUETTAWATT)

      expect(power.toString(PowerUnit.QUETTAWATT)).toBe('1 QW')
    })
  })
})
