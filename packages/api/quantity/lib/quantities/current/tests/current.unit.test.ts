import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Current } from '../current.js'
import { CurrentUnit } from '../current-unit.enum.js'
import { Rate } from '../../../rate.js'

void describe('Current class', () => {
  void describe('Current calculations', () => {
    void it('adds currents', () => {
      const c1 = new Current(10, CurrentUnit.AMPERE)
      const c2 = new Current(500, CurrentUnit.MILLIAMPERE)
      const r: Current = c1.add(c2)

      expect(r.isEqualTo(10.5, CurrentUnit.AMPERE)).toBe(true)
    })

    void it('subtracts currents', () => {
      const c1 = new Current(10, CurrentUnit.AMPERE)
      const c2 = new Current(500, CurrentUnit.MILLIAMPERE)
      const r: Current = c1.subtract(c2)

      expect(r.isEqualTo(9500, CurrentUnit.MILLIAMPERE)).toBe(true)
    })

    void it('divides currents', () => {
      const c1 = new Current(1, CurrentUnit.AMPERE)
      const c2 = new Current(250, CurrentUnit.MILLIAMPERE)

      const r1: Current = c1.divide(2)
      const r2: number = c1.divide(c2)
      const r3: number = c1.divide(0.5, CurrentUnit.AMPERE)

      expect(r1.isEqualTo(500, CurrentUnit.MILLIAMPERE)).toBe(true)
      expect(r2).toBe(4)
      expect(r3).toBe(2)
    })

    void it('takes a rate of a current', () => {
      const c1 = new Current(100, CurrentUnit.AMPERE)
      const p1 = Rate.fromPercent(10)
      const p2 = Rate.fromPermille(3)
      const p3 = Rate.fromDecimal(0.25)
      const r1 = c1.multiply(p1)
      const r2 = c1.multiply(p2)
      const r3 = c1.multiply(p3)

      expect(r1.isEqualTo(10, CurrentUnit.AMPERE)).toBe(true)
      expect(r2.isEqualTo(300, CurrentUnit.MILLIAMPERE)).toBe(true)
      expect(r3.isEqualTo(25, CurrentUnit.AMPERE)).toBe(true)
    })
  })
})
