import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Voltage } from '../voltage.js'
import { VoltageUnit } from '../voltage-unit.enum.js'

void describe('Voltage class', () => {
  void describe('Voltage calculations', () => {
    void it('adds voltages', () => {
      const v1 = new Voltage(1, VoltageUnit.VOLT)
      const v2 = new Voltage(500, VoltageUnit.MILLIVOLT)
      const r: Voltage = v1.add(v2)

      expect(r.isEqualTo(1.5, VoltageUnit.VOLT)).toBe(true)
    })

    void it('subtracts voltages', () => {
      const v1 = new Voltage(2, VoltageUnit.VOLT)
      const v2 = new Voltage(1, VoltageUnit.KILOVOLT)
      const r: Voltage = v1.subtract(v2)

      expect(r.isEqualTo(-998, VoltageUnit.VOLT)).toBe(true)
    })

    void it('divides voltages', () => {
      const v1 = new Voltage(10, VoltageUnit.VOLT)
      const v2 = new Voltage(2, VoltageUnit.VOLT)

      const r1: Voltage = v1.divide(2)
      const r2: number = v1.divide(v2)
      const r3: number = v1.divide(5, VoltageUnit.VOLT)

      expect(r1.isEqualTo(5, VoltageUnit.VOLT)).toBe(true)
      expect(r2).toBe(5)
      expect(r3).toBe(2)
    })

    void it('multiplies voltages', () => {
      const v1 = new Voltage(5, VoltageUnit.VOLT)
      const r: Voltage = v1.multiply(3)

      expect(r.isEqualTo(15, VoltageUnit.VOLT)).toBe(true)
    })
  })

  void describe('Voltage conversions', () => {
    void it('converts V to mV', () => {
      const v = new Voltage(1.5, VoltageUnit.VOLT)

      expect(v.isEqualTo(1500, VoltageUnit.MILLIVOLT)).toBe(true)
    })

    void it('converts mV to V', () => {
      const v = new Voltage(1500, VoltageUnit.MILLIVOLT)

      expect(v.isEqualTo(1.5, VoltageUnit.VOLT)).toBe(true)
    })

    void it('converts V to kV', () => {
      const v = new Voltage(2000, VoltageUnit.VOLT)

      expect(v.isEqualTo(2, VoltageUnit.KILOVOLT)).toBe(true)
    })

    void it('converts kV to V', () => {
      const v = new Voltage(2, VoltageUnit.KILOVOLT)

      expect(v.isEqualTo(2000, VoltageUnit.VOLT)).toBe(true)
    })

    void it('converts mV to kV', () => {
      const v = new Voltage(500000, VoltageUnit.MILLIVOLT)

      expect(v.isEqualTo(0.5, VoltageUnit.KILOVOLT)).toBe(true)
    })
  })

  void describe('Voltage comparisons', () => {
    void it('compares voltages correctly', () => {
      const v1 = new Voltage(1000, VoltageUnit.MILLIVOLT)
      const v2 = new Voltage(1, VoltageUnit.VOLT)
      const v3 = new Voltage(2, VoltageUnit.VOLT)

      expect(v1.isEqualTo(v2)).toBe(true)
      expect(v3.isMoreThan(v2)).toBe(true)
      expect(v2.isLessThan(v3)).toBe(true)
      expect(v2.isMoreThanOrEqualTo(v1)).toBe(true)
      expect(v2.isLessThanOrEqualTo(v1)).toBe(true)
    })
  })

  void describe('Voltage utilities', () => {
    void it('returns min voltage using static method', () => {
      const v1 = new Voltage(1, VoltageUnit.VOLT)
      const v2 = new Voltage(1500, VoltageUnit.MILLIVOLT)
      const r: Voltage = Voltage.min(v1, v2)

      expect(r.isEqualTo(1, VoltageUnit.VOLT)).toBe(true)
    })

    void it('returns max voltage using static method', () => {
      const v1 = new Voltage(1, VoltageUnit.VOLT)
      const v2 = new Voltage(1500, VoltageUnit.MILLIVOLT)
      const r: Voltage = Voltage.max(v1, v2)

      expect(r.isEqualTo(1.5, VoltageUnit.VOLT)).toBe(true)
    })

    void it('rounds voltage value', () => {
      const v1 = new Voltage(1.52, VoltageUnit.VOLT)
      const r: Voltage = v1.round()

      expect(r.isEqualTo(2, VoltageUnit.VOLT)).toBe(true)
    })
  })

  void describe('Voltage formatting', () => {
    void it('converts to string', () => {
      const v = new Voltage(1.5, VoltageUnit.VOLT)

      expect(v.toString()).toBe('1.5V')
    })

    void it('converts to JSON', () => {
      const v = new Voltage(1.5, VoltageUnit.VOLT)
      const json = v.toJSON()

      expect(json).toEqual({ value: 1.5, unit: VoltageUnit.VOLT })
    })
  })
})
