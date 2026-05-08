import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { FutureInfinity } from '../future-infinity.js'
import { PastInfinity } from '../past-infinity.js'
import { timestamp } from '../index.js'
import { initDayjs } from '../../common/init-dayjs.js'

describe('FutureInfinity timestamp', () => {
  before(() => initDayjs())

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinity()
      const duration = futureInfinity.until(futureInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns negative infinity when compared to a regular timestamp', () => {
      const futureInfinity = new FutureInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = futureInfinity.until(regular)

      expect(duration.milliseconds).toBe(-Infinity)
    })

    it('returns negative infinity when compared to PastInfinity', () => {
      const futureInfinity = new FutureInfinity()
      const pastInfinity = new PastInfinity()
      const duration = futureInfinity.until(pastInfinity)

      expect(duration.milliseconds).toBe(-Infinity)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinity()
      const duration = futureInfinity.since(futureInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns positive infinity when compared to a regular timestamp', () => {
      const futureInfinity = new FutureInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = futureInfinity.since(regular)

      expect(duration.milliseconds).toBe(Infinity)
    })

    it('returns positive infinity when compared to PastInfinity', () => {
      const futureInfinity = new FutureInfinity()
      const pastInfinity = new PastInfinity()
      const duration = futureInfinity.since(pastInfinity)

      expect(duration.milliseconds).toBe(Infinity)
    })
  })

  describe('compare', () => {
    it('returns 0 when comparing to itself', () => {
      const futureInfinity = new FutureInfinity()
      const result = futureInfinity.compare(futureInfinity)

      expect(result).toBe(0)
    })

    it('returns 0 when comparing to another FutureInfinity instance', () => {
      const futureInfinity1 = new FutureInfinity()
      const futureInfinity2 = new FutureInfinity()
      const result = futureInfinity1.compare(futureInfinity2)

      expect(result).toBe(0)
    })

    it('returns positive infinity when compared to a regular timestamp', () => {
      const futureInfinity = new FutureInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const result = futureInfinity.compare(regular)

      expect(result).toBe(Infinity)
    })

    it('returns positive infinity when compared to PastInfinity', () => {
      const futureInfinity = new FutureInfinity()
      const pastInfinity = new PastInfinity()
      const result = futureInfinity.compare(pastInfinity)

      expect(result).toBe(Infinity)
    })

    it('can be used in sorting with regular timestamps', () => {
      const timestamps = [
        timestamp('2025-01-01T00:00:00Z'),
        new FutureInfinity(),
        timestamp('2025-06-01T00:00:00Z')
      ]

      timestamps.sort((a, b) => a.compare(b))

      expect(timestamps[0].toISOString()).toBe('2025-01-01T00:00:00.000Z')
      expect(timestamps[1].toISOString()).toBe('2025-06-01T00:00:00.000Z')
      expect(timestamps[2].isFutureInfinity()).toBe(true)
    })
  })
})
