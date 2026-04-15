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
})
