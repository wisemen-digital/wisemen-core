import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Mass } from '../mass.js'
import { MassUnit } from '../mass-unit.enum.js'

void describe('Mass class', () => {
  void describe('Mass calculations', () => {
    void it('adds masses', () => {
      const m1 = new Mass(1, MassUnit.KILOGRAM)
      const m2 = new Mass(500, MassUnit.GRAM)
      const r: Mass = m1.add(m2)

      expect(r.isEqualTo(1.5, MassUnit.KILOGRAM)).toBe(true)
    })

    void it('subtracts masses', () => {
      const m1 = new Mass(1, MassUnit.KILOGRAM)
      const m2 = new Mass(250, MassUnit.GRAM)
      const r: Mass = m1.subtract(m2)

      expect(r.isEqualTo(750, MassUnit.GRAM)).toBe(true)
    })

    void it('divides masses', () => {
      const m1 = new Mass(1, MassUnit.KILOGRAM)
      const m2 = new Mass(250, MassUnit.GRAM)

      const r1: Mass = m1.divide(2)
      const r2: number = m1.divide(m2)
      const r3: number = m1.divide(0.5, MassUnit.KILOGRAM)

      expect(r1.isEqualTo(500, MassUnit.GRAM)).toBe(true)
      expect(r2).toBe(4)
      expect(r3).toBe(2)
    })
  })

  void describe('Mass conversions', () => {
    void it('converts kg to g', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.isEqualTo(1000, MassUnit.GRAM)).toBe(true)
    })

    void it('converts kg to mg', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.isEqualTo(1_000_000, MassUnit.MILLIGRAM)).toBe(true)
    })

    void it('converts kg to tonnes', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.to(MassUnit.TONNE).value).toBeCloseTo(0.001, 6)
    })

    void it('converts kg to pounds', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.to(MassUnit.POUND).value).toBeCloseTo(2.2046226, 6)
    })

    void it('converts kg to ounces', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.to(MassUnit.OUNCE).value).toBeCloseTo(35.27396, 5)
    })
  })

  void describe('Mass getters', () => {
    void it('returns kilograms and grams', () => {
      const mass = new Mass(1, MassUnit.KILOGRAM)

      expect(mass.kilograms).toBe(1)
      expect(mass.grams).toBe(1000)
    })
  })

  void describe('Mass formatting', () => {
    void it('converts to string', () => {
      const mass = new Mass(10, MassUnit.KILOGRAM)

      expect(mass.toString()).toBe('10kg')
    })

    void it('converts to JSON', () => {
      const mass = new Mass(10, MassUnit.KILOGRAM)
      const json = mass.toJSON()

      expect(json).toEqual({
        value: 10,
        unit: MassUnit.KILOGRAM
      })
    })
  })
})
