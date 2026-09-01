import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Current } from '#lib/quantities/current/current.js'
import { CurrentUnit } from '#lib/quantities/current/current-unit.enum.js'
import { Rate } from '#lib/rate/rate.js'

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

    void it('formats a current as a string', () => {
      const c1 = new Current(10, CurrentUnit.AMPERE)
      const c2 = new Current(500, CurrentUnit.MILLIAMPERE)
      const c3 = new Current(0.5, CurrentUnit.AMPERE)

      expect(c1.format('nl-BE')).toBe('10 A')
      expect(c2.format('nl-BE')).toBe('500 mA')
      expect(c3.format('nl-BE')).toBe('0,5 A')
      expect(c3.format('nl-BE', { minimumFractionDigits: 3, maximumFractionDigits: 3})).toBe('0,500 A')

      expect(c1.format('en-US')).toBe('10 A')
      expect(c2.format('en-US')).toBe('500 mA')
      expect(c3.format('en-US')).toBe('0.5 A')
      expect(c3.format('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3})).toBe('0.500 A')
    })
  })

  void describe('Current parsing', () => {
    void it('parses current strings with SI units', () => {
      const current = new Current('10mA')

      expect(current.value).toBe(10)
      expect(current.unit).toBe(CurrentUnit.MILLIAMPERE)
      expect(current.isEqualTo(0.01, CurrentUnit.AMPERE)).toBe(true)
    })

    void it('parses signed and decimal current strings', () => {
      const current = new Current('-0.5A')

      expect(current.value).toBe(-0.5)
      expect(current.unit).toBe(CurrentUnit.AMPERE)
    })

    void it('parses current strings with unicode units', () => {
      const current = new Current('12μA')

      expect(current.value).toBe(12)
      expect(current.unit).toBe(CurrentUnit.MICROAMPERE)
    })

    void it('parses current strings with larger SI units', () => {
      const current = new Current('1.5kA')

      expect(current.value).toBe(1.5)
      expect(current.unit).toBe(CurrentUnit.KILOAMPERE)
    })

    void it('rejects invalid current strings', () => {
      expect(() => new Current('invalid')).toThrow('Invalid quantity string invalid')
      expect(() => new Current('10 A')).toThrow('Invalid quantity string 10 A')
    })
  })
})
