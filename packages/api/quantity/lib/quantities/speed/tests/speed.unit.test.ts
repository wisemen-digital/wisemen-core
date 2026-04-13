import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Speed } from '../speed.js'
import { SpeedUnit } from '../speed-unit.enum.js'

void describe('Speed class', () => {
  void describe('Speed calculations', () => {
    void it('adds speeds', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(3.6, SpeedUnit.KILOMETER_PER_HOUR)
      const r: Speed = s1.add(s2)

      expect(r.isEqualTo(11, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('subtracts speeds', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(3.6, SpeedUnit.KILOMETER_PER_HOUR)
      const r: Speed = s1.subtract(s2)

      expect(r.isEqualTo(9, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('divides speeds', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(5, SpeedUnit.METER_PER_SECOND)

      const r1: Speed = s1.divide(2)
      const r2: number = s1.divide(s2)
      const r3: number = s1.divide(5, SpeedUnit.METER_PER_SECOND)

      expect(r1.isEqualTo(5, SpeedUnit.METER_PER_SECOND)).toBe(true)
      expect(r2).toBe(2)
      expect(r3).toBe(2)
    })

    void it('multiplies speeds', () => {
      const s1 = new Speed(5, SpeedUnit.METER_PER_SECOND)
      const r: Speed = s1.multiply(2)

      expect(r.isEqualTo(10, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })
  })

  void describe('Speed conversions', () => {
    void it('converts m/s to km/h', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.isEqualTo(36, SpeedUnit.KILOMETER_PER_HOUR)).toBe(true)
    })

    void it('converts km/h to m/s', () => {
      const speed = new Speed(36, SpeedUnit.KILOMETER_PER_HOUR)

      expect(speed.isEqualTo(10, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('converts m/s to mph', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.to(SpeedUnit.MILES_PER_HOUR).value).toBeCloseTo(22.369, 2)
    })

    void it('converts m/s to knots', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.to(SpeedUnit.KNOT).value).toBeCloseTo(19.438, 2)
    })

    void it('converts m/s to ft/s', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.to(SpeedUnit.FOOT_PER_SECOND).value).toBeCloseTo(32.808, 2)
    })

    void it('converts m/s to cm/s', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.isEqualTo(1000, SpeedUnit.CENTIMETER_PER_SECOND)).toBe(true)
    })

    void it('converts m/s to mm/s', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.isEqualTo(10000, SpeedUnit.MILLIMETER_PER_SECOND)).toBe(true)
    })

    void it('converts m/s to μm/s', () => {
      const speed = new Speed(1, SpeedUnit.METER_PER_SECOND)

      expect(speed.isEqualTo(1000000, SpeedUnit.MICROMETER_PER_SECOND)).toBe(true)
    })
  })

  void describe('Speed comparisons', () => {
    void it('compares speeds correctly', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(36, SpeedUnit.KILOMETER_PER_HOUR)
      const s3 = new Speed(5, SpeedUnit.METER_PER_SECOND)

      expect(s1.isEqualTo(s2)).toBe(true)
      expect(s1.isMoreThan(s3)).toBe(true)
      expect(s3.isLessThan(s1)).toBe(true)
      expect(s1.isMoreThanOrEqualTo(s2)).toBe(true)
      expect(s1.isLessThanOrEqualTo(s2)).toBe(true)
    })
  })

  void describe('Speed utilities', () => {
    void it('returns minimum speed using static method', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(5, SpeedUnit.METER_PER_SECOND)
      const r: Speed = Speed.min(s1, s2)

      expect(r.isEqualTo(5, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('returns maximum speed using static method', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(5, SpeedUnit.METER_PER_SECOND)
      const r: Speed = Speed.max(s1, s2)

      expect(r.isEqualTo(10, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('rounds speed value', () => {
      const s1 = new Speed(10.7, SpeedUnit.METER_PER_SECOND)
      const r: Speed = s1.round()

      expect(r.isEqualTo(11, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('ceils speed value', () => {
      const s1 = new Speed(10.2, SpeedUnit.METER_PER_SECOND)
      const r: Speed = s1.ceil()

      expect(r.isEqualTo(11, SpeedUnit.METER_PER_SECOND)).toBe(true)
    })

    void it('checks if value is rounded', () => {
      const s1 = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const s2 = new Speed(10.5, SpeedUnit.METER_PER_SECOND)

      expect(s1.isRounded()).toBe(true)
      expect(s2.isRounded()).toBe(false)
    })
  })

  void describe('Speed formatting', () => {
    void it('converts to string', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)

      expect(speed.toString()).toBe('10m/s')
    })

    void it('converts to JSON', () => {
      const speed = new Speed(10, SpeedUnit.METER_PER_SECOND)
      const json = speed.toJSON()

      expect(json).toEqual({
        value: 10,
        unit: SpeedUnit.METER_PER_SECOND
      })
    })
  })
})
