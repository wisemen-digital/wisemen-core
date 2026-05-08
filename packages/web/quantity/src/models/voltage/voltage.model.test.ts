import {
  VoltageDto,
  VoltageUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Voltage } from './voltage.model'

describe('voltage', () => {
  describe('constructor', () => {
    it('creates a voltage with value and unit', () => {
      const voltage = new Voltage(230, VoltageUnit.VOLT)

      expect(voltage.value).toBe(230)
      expect(voltage.unit).toBe(VoltageUnit.VOLT)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const voltage = new Voltage(230, VoltageUnit.VOLT)

      expect(voltage.getValueIn(VoltageUnit.VOLT)).toBe(230)
    })

    it('converts volt to millivolt', () => {
      const voltage = new Voltage(1.5, VoltageUnit.VOLT)

      expect(voltage.getValueIn(VoltageUnit.MILLIVOLT)).toBe(1500)
    })

    it('converts volt to kilovolt', () => {
      const voltage = new Voltage(11_000, VoltageUnit.VOLT)

      expect(voltage.getValueIn(VoltageUnit.KILOVOLT)).toBe(11)
    })

    it('converts millivolt to volt', () => {
      const voltage = new Voltage(500, VoltageUnit.MILLIVOLT)

      expect(voltage.getValueIn(VoltageUnit.VOLT)).toBe(0.5)
    })
  })

  describe('toDto', () => {
    it('returns a VoltageDto', () => {
      const voltage = new Voltage(230, VoltageUnit.VOLT)
      const dto = voltage.toDto()

      expect(dto).toBeInstanceOf(VoltageDto)
      expect(dto.value).toBe(230)
      expect(dto.unit).toBe(VoltageUnit.VOLT)
    })
  })

  describe('toString', () => {
    it('formats volts', () => {
      const voltage = new Voltage(1, VoltageUnit.VOLT)

      expect(voltage.toString(VoltageUnit.VOLT)).toBe('1 V')
    })

    it('formats millivolts', () => {
      const voltage = new Voltage(1, VoltageUnit.MILLIVOLT)

      expect(voltage.toString(VoltageUnit.MILLIVOLT)).toBe('1 mV')
    })

    it('formats kilovolts', () => {
      const voltage = new Voltage(1, VoltageUnit.KILOVOLT)

      expect(voltage.toString(VoltageUnit.KILOVOLT)).toBe('1 kV')
    })
  })
})
