import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Distance } from '../distance.js'
import { DistanceUnit } from '../distance-unit.enum.js'

void describe('Distance class', () => {
  void describe('Distance calculations', () => {
    void it('adds distances', () => {
      const d1 = new Distance(10, DistanceUnit.METER)
      const d2 = new Distance(50, DistanceUnit.CENTIMETER)
      const r: Distance = d1.add(d2)

      expect(r.isEqualTo(10.5, DistanceUnit.METER)).toBe(true)
    })

    void it('subtracts distances', () => {
      const d1 = new Distance(10, DistanceUnit.METER)
      const d2 = new Distance(50, DistanceUnit.CENTIMETER)
      const r: Distance = d1.subtract(d2)

      expect(r.isEqualTo(950, DistanceUnit.CENTIMETER)).toBe(true)
    })

    void it('divides distances', () => {
      const d1 = new Distance(1, DistanceUnit.METER)
      const d2 = new Distance(25, DistanceUnit.CENTIMETER)

      const r1: Distance = d1.divide(2)
      const r2: number = d1.divide(d2)
      const r3: number = d1.divide(0.5, DistanceUnit.METER)

      expect(r1.isEqualTo(50, DistanceUnit.CENTIMETER)).toBe(true)
      expect(r2).toBe(4)
      expect(r3).toBe(2)
    })
  })
})
