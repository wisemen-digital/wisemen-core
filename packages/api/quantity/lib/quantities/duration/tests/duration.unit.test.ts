import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Duration } from '../duration.js'
import { DurationUnit } from '../duration-unit.enum.js'

describe('Duration unit tests', () => {
  describe('milliseconds', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.milliseconds).toBe(3600_000)
    })
  })

  describe('seconds', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.seconds).toBe(3600)
    })
  })

  describe('minutes', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.minutes).toBe(60)
    })
  })

  describe('hours', () => {
    it('reports the correct amount of seconds', () => {
      const duration = new Duration(1, DurationUnit.HOURS)

      expect(duration.hours).toBe(1)
    })
  })
})
